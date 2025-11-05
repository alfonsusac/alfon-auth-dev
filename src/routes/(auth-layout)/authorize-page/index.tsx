import { AuthorizePageInvalidParameter, AuthorizeProjectNotFoundContent } from "./errors"
import { AuthorizeProjectNotAuthenticated } from "./not-authenticated"
import { authPage } from "../layout"
import { authorizePageRoute, withContext } from "@/routes/routes"
import { requireUesr } from "@/shared/auth/admin-only"
import { validateAuthorizeCode, validateRedirectUri } from "@/services/auth/validations"
import { isError } from "@/module/action/error"
import { getAllProjectDomainsOfProject, getProject, getProjectDomainByOrigin } from "@/services/project/db"
import { AuthorizeProjectUI } from "./authorize-project-ui"
import { allowProjectAuthorization, denyProjectAuthorization } from "@/services/auth/logic"
import {  getUser } from "@/shared/auth/auth"
import { navigate } from "@/module/navigation"

// server receives: projectid, redirect_uri, code, next

const authorizePage = authPage('/[projectid]/authorize', async page => {

  const project = await getProject(page.projectid)
  const project_domains = await getAllProjectDomainsOfProject(page.projectid)
  const redirect_uri = validateRedirectUri(page.searchParams.redirect_uri)
  if (!project) return <AuthorizeProjectNotFoundContent projectid={page.projectid} />
  if (!project_domains.length) return <AuthorizePageInvalidParameter message="no registered domain for this project" />
  if (isError(redirect_uri)) return <AuthorizePageInvalidParameter message={redirect_uri} />

  const project_domain = await getProjectDomainByOrigin(redirect_uri.origin())
  const code = validateAuthorizeCode(page.searchParams.code)
  const next = validateAuthorizeCode(page.searchParams.next)
  if (!project_domain) return <AuthorizePageInvalidParameter message="redirect_uri does not match any registered domain" />
  if (isError(code)) return <AuthorizePageInvalidParameter message={code} />
  if (isError(next)) return <AuthorizePageInvalidParameter message={next} />
  if (!page.user) return <AuthorizeProjectNotAuthenticated project={project} redirectTo={withContext(authorizePageRoute(project.id), { redirect_uri: redirect_uri.toString(), code: code.val, next: next.val })} />

  return <>
    <AuthorizeProjectUI
      project={project}
      user={{
        name: page.user.name || 'Unknown',
        picture: page.user.avatarUrl || undefined,
      }}
      onAuthorize={async () => {
        "use server"
        await requireUesr()
        const project = await getProject(page.projectid)
        const redirect_uri = validateRedirectUri(page.searchParams.redirect_uri)
        if (!project || isError(redirect_uri)) return navigate.refresh()

        const domain = await getProjectDomainByOrigin(redirect_uri.origin())
        const code = validateAuthorizeCode(page.searchParams.code)
        const next = validateAuthorizeCode(page.searchParams.next)
        const user = await getUser()
        if (!user || !domain || isError(code) || isError(next)) return navigate.refresh()

        const res = await allowProjectAuthorization({ user, domain, project, redirect_uri, code: code.val, next: next.val })
        console.log('onauthorize result', res)
        if (isError(res)) {
          return navigate.refresh()
        }
        return navigate.replace(res.nextStepUrl)
      }}
      onDeny={async () => {
        "use server"
        await requireUesr()
        const project = await getProject(page.projectid)
        const redirect_uri = validateRedirectUri(page.searchParams.redirect_uri)
        if (!project || isError(redirect_uri)) return navigate.refresh()

        const res = await denyProjectAuthorization({ redirect_uri, code: code.val, next: next.val })
        return navigate.replace(res.nextStepUrl)
      }}
    />
  </>
})

export default authorizePage