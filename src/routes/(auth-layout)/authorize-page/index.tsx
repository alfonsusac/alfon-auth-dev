import { getAllProjectDomainsOfProject, getProject } from "@/services/projects"
import { AuthorizePageInvalidParameter, AuthorizeProjectNotFoundContent } from "./errors"
import { AuthorizeProjectNotAuthenticated } from "./not-authenticated"
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url"
import { matchRedirectURI } from "@/lib/url/url-oauth"
import { authPage } from "../layout"
import { route, withContext } from "@/routes/routes"
import { Header, Row, Section, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import { Link } from "@/lib/link/link"
import { ActionButton } from "@/lib/formv2/form-component"
import { LogoIcon } from "@/shared/logo"
import { IconRight } from "@/shared/icons"

export default authPage('/[projectid]/authorize', async page => {

  const { projectid } = page
  const {
    projectNotFound,
    invalidParameter,
    project,
    redirect_uri,
    code,
    next,
  } = await (async () => {
    const project = await getProject(projectid)
    if (!project) return { projectNotFound: true } as const
    const project_domain = await getAllProjectDomainsOfProject(projectid)
    if (!project_domain.length) return { invalidParameter: "no registered domain for this project" } as const

    // redirect_uri
    const redirect_uri = page.searchParams.redirect_uri
    if (!redirect_uri) return { invalidParameter: "redirect_uri parameter missing" } as const
    if (Array.isArray(redirect_uri)) return { invalidParameter: "redirect_uri parameter found multiple" } as const

    const isRedirectUriMatch = project_domain.some(domain => matchRedirectURI(parseUrl(redirect_uri), parseUrl(domain.redirect_url)) === true)
    if (!isRedirectUriMatch) return { invalidParameter: "redirect_uri does not match any registered domain" } as const

    // code
    const code = page.searchParams.code
    if (Array.isArray(code)) return { invalidParameter: "multiple code parameters" } as const
    if (!code) return { invalidParameter: "missing code parameter" } as const

    // next
    const next = page.searchParams.next
    if (Array.isArray(next)) return { invalidParameter: "multiple next parameters" } as const

    return { project, project_domain, redirect_uri, code, next }
  })()

  if (projectNotFound) return <AuthorizeProjectNotFoundContent projectid={projectid} />
  if (invalidParameter) return <AuthorizePageInvalidParameter message={invalidParameter} />

  if (!page.user) return <AuthorizeProjectNotAuthenticated
    project={project}
    redirectTo={withContext(route.authorizePage(projectid), { redirect_uri, code, next })}
  />

  return <>


    <div className="p-8 rounded-2xl bg-foreground-muted/10 max-w-80 gap-0">
      <Header>
        <div className="self-center flex gap-3 items-center">
          <LogoIcon className="size-10 -mx-1" />
          <IconRight className="opacity-50" />
          {/* Project Icon */}
          <div className="self-center block size-10 rounded-full bg-blue-500/25 shrink-0" />
        </div>
        <Title className="font-medium leading-relaxed text-lg font-semibold">
          {project.name} <br />
        </Title>
        <span className="text-xs -mt-2.5">
          wants to access your alfon.dev account
        </span>
      </Header>

      <Spacer half />

      <div className="w-full text-start">
        <Section className="text-xs text-pretty gap-1.5 w-full text-start">
          <div className="">
            {project.name} is requesting permission for
          </div>
          {/* Later: Get permissions from scope */}
          <ul className="list-disc pl-4 flex flex-col gap-2 my-2">
            <li>
              <div className="font-semibold">Identification</div>
              <div>Use your alfon.dev account to identify you</div>
            </li>
            <li>
              <div className="font-semibold">Profile Info</div>
              <div>View your basic profile info (name, email, profile picture)</div>
            </li>
          </ul>
        </Section>
      </div>

      <Spacer half />

      <Row className="-mx-4 -mb-4">
        <ActionButton
          action={async () => { "use server" }}
          loading={"Denying..."}
          className="small flex-1 w-full"
        >
          Deny
        </ActionButton>
        <ActionButton
          action={async () => { "use server" }}
          loading={"Authorizing..."}
          className="small flex-1 w-full primary"
        >
          Authorize
        </ActionButton>
      </Row>
    </div>
    <Row className="text-xs items-center text-start -my-6 p-4 pr-7 rounded-full bg-foreground-muted/10">
      {/* Avatar */}
      <div className="size-6 bg-blue-500/50 rounded-full relative">
        <img src={page.user.picture || undefined} alt={page.user.name || undefined} className="absolute inset-0 rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="leading-tight">
          signed in as
        </span>
        <div className="flex gap-1 items-center">
          <div className="font-semibold">{page.user.name}</div>
        </div>
      </div>
    </Row>

  </>
})

