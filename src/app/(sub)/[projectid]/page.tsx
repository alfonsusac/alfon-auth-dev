import { getCurrentUser, adminOnly, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { ProjectNotFound } from "./shared"
import { SuccessCallout } from "@/lib/SearchParamsCallout"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { formatDate } from "@/lib/date"
import { navigate } from "@/lib/resolveAction"
import { getAllProjectDomains, getAllProjectKeys, getProject, updateProject } from "@/services/projects"
import { CopyButton } from "@/lib/CopyButton"
import { form } from "@/lib/FormBasic"
import { AUTH } from "@/lib/auth_ui"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const projectid = (await props.params).projectid
  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  return <>
    <BackButton href="/">Home</BackButton>

    <SuccessCallout sp={props.searchParams} messages={{
      new: "project created successfully!",
      key_deleted: "key deleted successfully!",
      updated: "project updated!"
    }} />

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        auth.alfon.dev/{projectid}
      </code>
    </header>

    <AUTH.AdminOnly>
      <section className="category">
        <p className="category-title">edit details ↓</p>
        <form.EditForm
          name="edit_project"
          fields={{
            name: {
              label: "project name",
              helper: "give your project a name for identification",
              type: "text",
              defaultValue: project.name,
              required: true
            },
            id: {
              label: "project id",
              helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
              type: "text",
              prefix: "https://auth.alfon.dev/",
              defaultValue: project.id ?? "",
              required: true
            }
          }}
          action={async (inputs) => {
            "use server"
            await adminOnly(`/${ projectid }`)
            const res = await updateProject(inputs, project.id)
            resolveError(`/${ projectid }`, res)
            revalidatePath(`/${ projectid }`, 'layout')
            navigate(`/${ inputs.id }?info=updated`)
          }}
        />
      </section>

      <ProjectDomainsList projectid={projectid} />

      <ProjectKeysList projectid={projectid} />

      <section className="category">
        <p className="category-title">danger zone ↓</p>
        <a className="button destructive" href={`/${ projectid }/delete`}>
          Delete Project
        </a>
      </section>
    </AUTH.AdminOnly>

  </>

}


async function ProjectDomainsList(props: { projectid: string }) {
  const { projectid } = props
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const domains = await getAllProjectDomains(projectid)
  return (
    <section className="category">
      <div className="category-title">
        authorized domains ↓
      </div>
      <p className="category-title text-xxs">
        these domains are authorized to redirect to after authentication.
      </p>

      <ul className="list">
        {domains.length === 0 && <div className="list-empty">Domains not yet set up.</div>}
        {domains.map(domain =>
          <li className="relative group" key={domain.id} >
            <a className="button ghost flex flex-row py-3" href={`/${ projectid }/domain/${ domain.id }`}>
              <div className="text-foreground-body font-semibold leading-3 text-xs">
                {domain.redirect_url}
              </div>
              <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0 w-full">
                {domain.redirect_url}
              </div>
              <div className="text-foreground-body/75 leading-3 text-xs">
                {formatDate(domain.createdAt)}
              </div>
            </a>
          </li>
        )}
      </ul>
      <a className="button primary small -mt-1" href={`/${ projectid }/domain/create`}>
        Add Domain
      </a>
    </section>
  )
}


async function ProjectKeysList(props: { projectid: string }) {
  const { projectid } = props
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const project_keys = await getAllProjectKeys(projectid)
  return (
    <section className="category">
      <div className="category-title">
        secret keys ↓
      </div>
      <p className="category-title text-xxs">
        you can create multiple keys for different environments (e.g. development, staging, production).
        this will be used to validate requests to /token endpoints.
      </p>

      <ul className="list">
        {project_keys.length === 0 && <div className="list-empty">No API keys present</div>}
        {project_keys.map((key) =>
          <li className="relative group" key={key.id} >
            <a className="list-row" href={`/${ projectid }/key/${ key.id }`} >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="text-foreground-body font-semibold leading-3 text-xs">
                  🔑 {key.name}
                  <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                    {' - '}{formatDate(key.createdAt)}
                  </span>
                </div>
                <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0 w-full">
                  {key.client_secret}
                </div>
              </div>
            </a>
            <div className="absolute top-1 right-1">
              <CopyButton text={key.client_secret} className="button small floating opacity-0 group-hover:opacity-100">
                copy
              </CopyButton>
            </div>
          </li>
        )}
      </ul>

      <a className="button primary small -mt-1" href={`/${ projectid }/key/create`}>
        Create API Key
      </a>
    </section>
  )
}