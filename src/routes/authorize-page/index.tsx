import { Page, page } from "@/lib/page"
import { getAllProjectDomainsOfProject, getProject } from "@/services/projects"
import { AuthorizePageInvalidParameter, AuthorizeProjectNotFoundContent } from "./errors"
import { Header } from "@/lib/primitives"
import { Logo } from "@/shared/logot"
import { AuthorizeProjectNotAuthenticated } from "./not-authenticated"
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url"
import { matchRedirectURI } from "@/lib/url/url-oauth"

export default page('/[projectid]/authorize', async page => {

  const { projectid } = page
  const {
    projectNotFound,
    invalidParameter,
    project,
    project_domain,
    redirect_uri
  } = await (async () => {
    const project = await getProject(projectid)
    if (!project) return { projectNotFound: true } as const
    const project_domain = await getAllProjectDomainsOfProject(projectid)
    if (!project_domain.length) return { invalidParameter: "no registered domain for this project" } as const

    const redirect_uri = page.searchParams.redirect_uri
    if (!redirect_uri) return { invalidParameter: "redirect_uri parameter missing" } as const
    if (Array.isArray(redirect_uri)) return { invalidParameter: "redirect_uri parameter found multiple" } as const

    const isRedirectUriMatch = project_domain.some(domain => matchRedirectURI(parseUrl(redirect_uri), parseUrl(domain.redirect_url)) === true)
    if (!isRedirectUriMatch) return { invalidParameter: "redirect_uri does not match any registered domain" } as const

    const code = page.searchParams.code
    if (Array.isArray(code)) return { invalidParameter: "multiple code parameters" } as const
    if (!code) return { invalidParameter: "missing code parameter" } as const

    return { project, project_domain, redirect_uri }
  })()

  if (projectNotFound) return <AuthorizeProjectNotFoundContent projectid={projectid} />
  if (invalidParameter) return <AuthorizePageInvalidParameter message={invalidParameter} />

  if (!page.user) return <AuthorizeProjectNotAuthenticated project={project} />

  // return <AuthorizePageContent />


  return <>
    {/* <AuthorizePageContent projectid={projectid} redirect_uri={redirect_uri || ''} /> */}

    {/* {!project ? <AuthorizeProjectNotFoundContent projectid={projectid} /> : */}
    {/* !page.user ? <AuthorizeProjectNotAuthenticated project={project} /> : */}
    {/* <></> */}
    {/* } */}
  </>
},
  children => <>
    <Page className="justify-center self-center mb-20 items-center text-center">
      <Header className="items-center">
        <Logo />
      </Header>
      {children}
    </Page>
  </>
)

