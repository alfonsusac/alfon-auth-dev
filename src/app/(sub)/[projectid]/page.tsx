import { getCurrentUser, actionAdminOnly, isAdmin } from "@/lib/auth"
import { actionResolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { formatDate } from "@/lib/date"
import { createDomain, deleteDomain, deleteProject, getAllProjectDomains, getAllProjectKeys, updateDomain, updateProject } from "@/services/projects"
import { CopyButton } from "@/lib/CopyButton"
import { form } from "@/lib/basic-form/AppForm"
import { AUTH } from "@/lib/auth_ui"
import { ErrorCallout, SuccessCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { Link } from "@/lib/link/Link"
import { actionNavigate } from "@/lib/resolveAction"
import { nanoid } from "nanoid"
import { DeleteDialogButton } from "@/lib/dialogs/DeleteDialog"
import { DataGridDisplay } from "@/lib/DataGrid"
import { pageData } from "@/app/data"
import { NavigationBar } from "@/lib/NavigationBar"
import { Dialog, DialogTitle } from "@/lib/dialogs/Dialog"
import { SubPage } from "@/lib/dialogs/SubpageDialog"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const { project, error } = await pageData.projectPage(props)
  if (error) return error

  return <>
    <SuccessCallout messages={{
      new: "project created successfully!",
      key_deleted: "key deleted successfully!",
      domain_deleted: "domain deleted successfully!",
      updated: "project updated!"
    }} />

    <NavigationBar back={['Home', '/']} />

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        auth.alfon.dev/{project.id}
      </code>
      <DataGridDisplay data={{
        'created at': new Date(project.createdAt),
        'updated at': new Date(project.updatedAt),
        'description': project.description,
      }} />
    </header>

    <AUTH.AdminOnly>
      <Dialog name={`edit_project_${ project.id }`}>
        {async (EditButton, EditDialog) => <>
          <EditButton className="button small -mt-8">
            Edit Project Details
          </EditButton>

          <EditDialog wide>
            <DialogTitle>Edit Project</DialogTitle>
            <form.EditForm
              name="edit_project"
              fields={{
                name: {
                  label: "project name",
                  helper: "give your project a name for identification",
                  type: "text",
                  defaultValue: project.name,
                  required: true,
                  autoFocus: true,
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
                }
              }}
              action={async (inputs) => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await updateProject(inputs, project.id)
                actionResolveError(res, { ...inputs, edit: 'show' })
                revalidatePath(`/`, 'layout')
                actionNavigate(`/${ inputs.id }?success=updated+${ nanoid(3) }`, "replace")
              }}
              searchParams={await props.searchParams}
              errorCallout={<ErrorCallout<typeof updateProject> messages={{
                invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
                missing_fields: "please fill out all required fields.",
                not_found: "project not found.",
                id_exists: "project id already exists.",
              }} />}
            />
          </EditDialog>
        </>}
      </Dialog>

      <ProjectDomainsList props={props} />
      <ProjectKeysList projectid={project.id} />

      <section className="category">
        <p className="category-title">danger zone ↓</p>
        <DeleteDialogButton
          name={`project-${ project.id }`}
          label="Delete Project"
          alertTitle={`Are you sure you want to permanently delete "${ project.name }"?`}
          alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
          alertActionLabel="Delete Project"
          action={async () => {
            "use server"
            await actionAdminOnly()
            const res = await deleteProject(project.id)
            actionResolveError(res, { delete: 'show' })
            revalidatePath('/', 'layout')
            actionNavigate('/?success=deleted')
          }}
        />
      </section>
    </AUTH.AdminOnly>

  </>

}


async function ProjectDomainsList(props: { props: PageProps<"/[projectid]"> }) {

  const { project, error } = await pageData.projectPage(props.props)
  if (error) return error
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const domains = await getAllProjectDomains(project.id)

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
          return <li className="relative group" key={domain.id}>
            <SubPage name={`domain_${ domain.id }`}>
              {(Button, SubPage) => <>
                <Button className="button ghost flex flex-col py-3 w-full items-start">
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
                </Button>

                <SubPage>
                  <ProjectDomainItemSubpage props={{
                    params: new Promise(res => res({ projectid: project.id, domainid: domain.id })),
                    searchParams: props.props.searchParams
                  }} />
                </SubPage>
              </>}
            </SubPage>
          </li>
        })}
      </ul>

      <Dialog name="add_url">
        {async (Button, Dialog) => <>
          <Button className="button small -mt-1">
            Add URL
          </Button>
          <Dialog wide>
            <DialogTitle>Add Project URL</DialogTitle>
            <form.CreateForm
              name="Add Project Domain"
              action={async inputs => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await createDomain({
                  project_id: inputs.project_id,
                  origin: inputs.origin,
                  redirect_url: inputs.origin + inputs.redirect_url,
                })
                actionResolveError(res, { ...inputs, add_url: 'show' })
                revalidatePath(`/${ project.id }`)
                actionNavigate(`/${ project.id }?success=domain_added`)
              }}
              fields={{
                project_id: {
                  type: 'readonly',
                  value: project.id
                },
                origin: {
                  label: "domain",
                  helper: "the domain where your application is hosted. (no trailing slash)",
                  placeholder: "https://example.com",
                  type: "text",
                  required: true
                },
                redirect_url: {
                  label: "redirect path",
                  prefix: 'https://your.domain.com',
                  placeholder: "/api/auth/callback",
                  type: "text",
                  required: true,
                  helper: "must be on the same domain as callback url"
                }
              }}
              searchParams={await props.props.searchParams}
              errorCallout={<ErrorCallout<typeof createDomain> messages={{
                project_not_found: "project not found.",
                missing_fields: "missing required fields.",
                invalid_origin: "invalid callback url format.",
                invalid_redirect_url: "invalid redirect url format.",
                mismatched_domains: "redirect url must be on the same domain as callback url.",
                insecure_origin: "origin must use https unless using localhost.",
                insecure_redirect_url: "redirect url must use https unless using localhost.",
                domain_exists: "domain already exists for this project.",
                domain_in_use: `domain is already in use by another project: $1`,
              }} />}
            />
          </Dialog>
        </>}
      </Dialog>

      {/* <DialogButton name="add_url" button={<button className="button small -mt-1">Add URL</button>}>
        <DialogPaper title="Add Project URL" wide>
          <form.CreateForm
            name="Add Project Domain"
            action={async inputs => {
              "use server"
              await actionAdminOnly(`/${ project.id }`)
              const res = await createDomain({
                project_id: inputs.project_id,
                origin: inputs.origin,
                redirect_url: inputs.origin + inputs.redirect_url,
              })
              actionResolveError(res, { ...inputs, add_url: 'show' })
              revalidatePath(`/${ project.id }`)
              actionNavigate(`/${ project.id }?success=domain_added`)
            }}
            fields={{
              project_id: {
                type: 'readonly',
                value: project.id
              },
              origin: {
                label: "domain",
                helper: "the domain where your application is hosted. (no trailing slash)",
                placeholder: "https://example.com",
                type: "text",
                required: true
              },
              redirect_url: {
                label: "redirect path",
                prefix: 'https://your.domain.com',
                placeholder: "/api/auth/callback",
                type: "text",
                required: true,
                helper: "must be on the same domain as callback url"
              }
            }}
            searchParams={await props.props.searchParams}
            errorCallout={<ErrorCallout<typeof createDomain> messages={{
              project_not_found: "project not found.",
              missing_fields: "missing required fields.",
              invalid_origin: "invalid callback url format.",
              invalid_redirect_url: "invalid redirect url format.",
              mismatched_domains: "redirect url must be on the same domain as callback url.",
              insecure_origin: "origin must use https unless using localhost.",
              insecure_redirect_url: "redirect url must use https unless using localhost.",
              domain_exists: "domain already exists for this project.",
              domain_in_use: `domain is already in use by another project: $1`,
            }} />}
          />
        </DialogPaper>
      </DialogButton> */}
    </section>
  )
}

async function ProjectDomainItemSubpage(props: { props: PageProps<"/[projectid]/domain/[domainid]"> }) {

  const { project, domain, error } = await pageData.projectDomainPage(props.props)
  if (error) return error
  const context = { [`domain_${ domain.id }`]: '' }

  // const [DomainEditDialog, DomainEditButton] = createDialog(`edit_domain_${ domain.id }`, context)

  return <div className="flex flex-col gap-12">
    <SuccessCallout messages={{
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <header>
      <h1 className="page-h1">{domain.origin}</h1>

      <DataGridDisplay data={{
        'redirect url': domain.redirect_url,
        'created at': new Date(domain.createdAt),
        'updated at': new Date(domain.updatedAt)
      }} />
    </header>

    <section className="category">

      <Dialog name={`edit_domain_${ domain.id }`} context={context}>
        {async (EditButton, EditDialog) => <>
          <EditButton className="button small -mt-8">
            Edit Domain Details
          </EditButton>
          <EditDialog wide>
            <DialogTitle>
              Edit Domain
            </DialogTitle>
            <form.EditForm
              name={"edit_project_domain"}
              action={async (inputs) => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await updateDomain({
                  project_id: inputs.project_id,
                  origin: inputs.origin,
                  redirect_url: inputs.origin + inputs.redirect_url,
                }, domain.id)
                actionResolveError(res, { ...inputs, ...context })
                revalidatePath(`/${ project.id }`)
                actionNavigate(`/${ project.id }?success=updated+${ nanoid(3) }`, "replace", context)
              }}
              fields={{
                project_id: {
                  type: 'readonly',
                  value: project.id,
                },
                origin: {
                  label: "allowed incoming domain",
                  helper: "the domain where your application is hosted. (no trailing slash)",
                  placeholder: "https://example.com",
                  type: "text",
                  required: true,
                  defaultValue: domain.origin
                },
                redirect_url: {
                  label: "redirect path",
                  prefix: 'https://your.domain.com',
                  placeholder: "/api/auth/callback",
                  type: "text",
                  required: true,
                  helper: "must be on the same domain as callback url",
                  defaultValue: domain.redirect_url.replace(domain.origin, '')
                }
              }}
              searchParams={await props.props.searchParams}
              errorCallout={<ErrorCallout<typeof updateDomain> messages={{
                missing_fields: "please fill out all required fields.",
                project_not_found: "project not found.",
                invalid_origin: "invalid origin.",
                invalid_redirect_url: "invalid redirect url.",
                mismatched_domains: "callback and redirect urls must share the same domain.",
                insecure_origin: "origin must use https unless using localhost.",
                insecure_redirect_url: "redirect url must use https unless using localhost.",
              }} />}
            />
          </EditDialog>
        </>}
      </Dialog>

    </section>

    <section className="category">
      <p className="category-title">danger zone ↓</p>

      <DeleteDialogButton
        name={`domain-${ domain.id }`}
        context2={context}
        label="Delete Project Domain"
        alertTitle="Are you sure you want to permanently delete this domain?"
        alertDescription="This action cannot be undone. Any applications using this domain will no longer be able to access the project."
        action={async () => {
          "use server"
          await actionAdminOnly()
          const res = await deleteDomain(domain.id)
          actionResolveError(res, { delete: 'show' })
          revalidatePath(`/${ project.id }`)
          actionNavigate(`/${ project.id }?success=domain_deleted`)
        }}
      />
    </section>
  </div>
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
      <Link className="button  small -mt-1" href={`/${ projectid }/key/create`}>
        Create API Key
      </Link>
    </section>
  )
}
