import { getCurrentUser, actionAdminOnly, isAdmin } from "@/lib/auth"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { formatDate } from "@/lib/date"
import { deleteProject, getAllProjectDomains, getAllProjectKeys, updateProject } from "@/services/projects"
import { CopyButton } from "@/lib/CopyButton"
import { form } from "@/lib/AppForm"
import { AUTH } from "@/lib/auth_ui"
import { ErrorCallout, SuccessCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { Link } from "@/lib/link/Link"
import { actionNavigate } from "@/lib/resolveAction"
import { nanoid } from "nanoid"
import { DeleteDialogButton } from "@/lib/dialogs/DeleteDialog"
import { DataGridDisplay } from "@/lib/DataGrid"
import { pageData } from "@/app/data"
import { NavigationBar } from "@/lib/NavigationBar"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const { project, error } = await pageData.projectPage(props)
  if (error) return error

  return <>
    <NavigationBar
      back={{
        href: "/",
        label: "Home"
      }}
      title={project.name}
    />

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        auth.alfon.dev/{project.id}
      </code>
      <DataGridDisplay data={{
        'created at': project.createdAt,
        'updated at': project.updatedAt,
        'description': project.description,
      }} />
    </header>

    <SuccessCallout messages={{
      new: "project created successfully!",
      key_deleted: "key deleted successfully!",
      domain_deleted: "domain deleted successfully!",
      updated: "project updated!"
    }} />

    <AUTH.AdminOnly>
      <ProjectDomainsList projectid={project.id} />
      <ProjectKeysList projectid={project.id} />
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
            },
            description: {
              label: "description",
              helper: "describe your project for future reference (optional)",
              type: "text",
              defaultValue: project.description ?? "",
              required: false
            }
          }}
          action={async (inputs) => {
            "use server"
            await actionAdminOnly(`/${ project.id }`)
            const res = await updateProject(inputs, project.id)
            resolveError(`/${ project.id }`, res)
            revalidatePath(`/${ project.id }`, 'layout')
            actionNavigate(`/${ inputs.id }?success=updated+${ nanoid(3) }`, "replace")
          }}
          searchParams={await props.searchParams}
          errorCallout={<ErrorCallout<typeof updateProject> messages={{
            invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
            missing_fields: "please fill out all required fields.",
            not_found: "project not found.",
          }} />}
        />
      </section>

      <section className="category">
        <p className="category-title">danger zone ↓</p>
        <DeleteDialogButton
          label="Delete Project"
          alertTitle={`Are you sure you want to permanently delete "${ project.name }"?`}
          alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
          alertActionLabel="Delete Project"
          action={async () => {
            "use server"
            await actionAdminOnly()
            const res = await deleteProject(project.id)
            resolveError(`/${ project.id }/delete`, res)
            revalidatePath('/')
            actionNavigate('/?success=deleted')
          }}
        />
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
        redirect urls ↓
      </div>
      <p className="category-title text-xxs">
        these urls are authorized to redirect to after authentication and also used to validate incoming requests.
      </p>

      <ul className="list">
        {domains.length === 0 && <div className="list-empty">Domains not yet set up.</div>}
        {domains.map(domain => {
          const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
          const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')
          return <li className="relative group" key={domain.id} >
            <Link className="button ghost flex flex-col py-3" href={`/${ projectid }/domain/${ domain.id }`}>
              <div className="text-foreground-body/75 leading-3 text-[0.813rem]">
                <span className="text-foreground-body/50">
                  {protocol}
                </span>
                <span className="font-medium text-foreground">
                  {origin}
                </span>
                <span>
                  {domain.redirect_url.replace(domain.origin, '')}
                </span>
              </div>
            </Link>
          </li>
        }
        )}
      </ul>
      <Link className="button primary small -mt-1" href={`/${ projectid }/domain/create`}>
        Add URL
      </Link>
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
            <Link className="list-row" href={`/${ projectid }/key/${ key.id }`} >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="text-foreground-body font-semibold leading-3 text-xs">
                  🔑 {key.name}
                  <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                    {' - '}{formatDate(key.createdAt)}
                  </span>
                </div>
                <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0">
                  {key.client_secret}
                </div>
              </div>
            </Link>
            <div className="absolute top-1 right-1">
              <CopyButton text={key.client_secret} className="button small floating opacity-0 group-hover:opacity-100">
                copy
              </CopyButton>
            </div>
          </li>
        )}
      </ul>
      <Link className="button primary small -mt-1" href={`/${ projectid }/key/create`}>
        Create API Key
      </Link>
    </section>
  )
}
