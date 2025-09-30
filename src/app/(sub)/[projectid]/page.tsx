import { getCurrentUser, actionAdminOnly, isAdmin } from "@/lib/auth"
import { actionResolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { createDomain, createProjectKey, deleteDomain, deleteProject, deleteProjectKey, getAllProjectDomains, getAllProjectKeys, regenerateProjectKeySecret, updateDomain, updateProject, updateProjectKey } from "@/services/projects"
import { CopyButton } from "@/lib/CopyButton"
import { form } from "@/lib/basic-form/app-form"
import { AUTH } from "@/lib/auth_ui"
import { ErrorCallout, SuccessCallout } from "@/lib/toast/search-param-toast.client"
import { actionNavigate } from "@/lib/resolveAction"
import { nanoid } from "nanoid"
import { DeleteDialogButton } from "@/lib/dialogs/dialog-delete"
import { DataGridDisplay } from "@/lib/DataGrid"
import { pageData } from "@/app/data"
import { NavigationBar } from "@/lib/NavigationBar"
import { Dialog, DialogTitle } from "@/lib/dialogs/dialog"
import { SubPage } from "@/lib/dialogs/dialog-subpage"
import { EditFormDialog } from "@/lib/basic-form/app-form-dialog"
import { Form } from "@/lib/basic-form/form"
import { FormButton } from "@/lib/FormButton"
import { IconAdd, IconSettings } from "@/lib/icons"
import { DateTime } from "@/lib/date.ui"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const { projectid, searchParams } = await pageData.resolve(props)
  const { project, error } = await pageData.projectPage2(projectid)

  if (error) return error

  console.log("Created At", project.createdAt)

  return <>
    <SuccessCallout messages={{
      new: "project created successfully!",
      key_deleted: "key deleted successfully!",
      domain_deleted: "domain deleted successfully!",
      updated: "project updated!",
    }} />
    <NavigationBar back={['Home', '/']} />
    <header>
      <h1 className="page-h1">{project.name}</h1>
      <DataGridDisplay data={{
        'project id': project.id,
        'description': project.description,
        'updated at': <DateTime date={project.updatedAt} />,
        'created at': <DateTime date={project.createdAt} />,
      }} />
    </header>

    <AUTH.AdminOnly>

      <ProjectDomainsList
        projectid={project.id}
        searchParams={searchParams}
      />

      <ProjectKeysList
        projectid={project.id}
      />


      <Dialog name={`project_setting_${ project.id }`}>{dialog => <>
        <dialog.Button className="button small ghost">
          <IconSettings className="icon icon-start" />
          Settings
        </dialog.Button>
        <dialog.Content wider>

          <section className="category">
            <h2 className="page-h2">Project Settings</h2>
            <h3 className="category-header">project details ↓</h3>
            <form.EditForm
              name={`edit_project_${ project.id }`}
              fields={{
                name: {
                  type: "text",
                  label: "project name",
                  helper: "give your project a name for identification",
                  defaultValue: project.name,
                  required: true,
                  autoFocus: true,
                },
                id: {
                  type: "text",
                  label: "project id",
                  helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
                  prefix: "https://auth.alfon.dev/",
                  defaultValue: project.id ?? "",
                  required: true
                },
                description: {
                  type: "text",
                  label: "description",
                  helper: "describe your project for future reference (optional)",
                  defaultValue: project.description ?? "",
                }
              }}
              searchParams={searchParams}
              errorCallout={<ErrorCallout<typeof updateProject> messages={{
                invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
                missing_fields: "please fill out all required fields.",
                not_found: "project not found.",
                id_exists: "project id already exists.",
              }} />}
              action={async (inputs) => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await updateProject(inputs, project.id)
                actionResolveError(res, { ...inputs, ...dialog.context })
                revalidatePath(`/`, 'layout')
                actionNavigate(`/${ inputs.id }?success=updated+${ nanoid(3) }`, "replace")
              }}
            />
          </section>

          <section className="category">
            <h3 className="category-header">danger zone ↓</h3>
            <DeleteDialogButton
              context2={dialog.context}
              name={`project-${ project.id }`}
              label="Delete Project"
              alertTitle={`Are you sure you want to permanently delete "${ project.name }"?`}
              alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
              alertActionLabel="Delete Project"
              action={async () => {
                "use server"
                await actionAdminOnly()
                const res = await deleteProject(project.id)
                actionResolveError(res, { delete: '' })
                revalidatePath('/', 'layout')
                actionNavigate('/?success=deleted')
              }}
            />
          </section>

        </dialog.Content>
      </>}
      </Dialog>
    </AUTH.AdminOnly >

  </>
}










async function ProjectDomainsList(props: {
  projectid: string,
  searchParams: PageSearchParams
}) {

  const { project, error } = await pageData.projectPage2(props.projectid)
  if (error) return error
  const domains = await getAllProjectDomains(project.id)

  return (
    <section className="category">
      <div className="category-header">
        <h2>redirect urls ↓</h2>
        <p className="text-xxs">
          these urls are authorized to redirect to after authentication and also used to validate incoming requests.
        </p>
      </div>

      <div className="flex flex-col">
        <ul className="list">
          {domains.map(domain => {
            const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
            const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')
            return <li className="relative group" key={domain.id}>
              <SubPage name={`domain_${ domain.id }`} children={subpage => <>
                <subpage.Button className="list-row">
                  <div className="text-foreground-body/75 leading-3 text-[0.813rem]">
                    <span className="text-foreground-body/50">{protocol}</span>
                    <span className="font-medium text-foreground">{origin}</span>
                    <span>{domain.redirect_url.replace(domain.origin, '')}</span>
                  </div>
                </subpage.Button>
                <subpage.Content>
                  <ProjectDomainSubpage
                    context={{ [`domain_${ domain.id }`]: '' }}
                    domainid={domain.id}
                    projectid={project.id}
                    searchParams={props.searchParams}
                  />
                </subpage.Content>
              </>} />
            </li>
          })}
        </ul>

      </div>
      <Dialog name="add_url" children={dialog => <>
        <dialog.Button className="button small">
          <IconAdd className="icon" /> Add URL
        </dialog.Button>
        <dialog.Content wide>
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
              actionResolveError(res, { ...inputs, ...dialog.context })
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
            searchParams={props.searchParams}
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
        </dialog.Content>
      </>} />
    </section>
  )
}



export async function ProjectDomainSubpage(props: {
  projectid: string,
  domainid: string,
  context?: PageContext,
  searchParams: PageSearchParams
}) {

  const { projectid, domainid, context } = props
  const { domain, project, error } = await pageData.projectDomainPage2(projectid, domainid)
  if (error) return error

  return <>
    <SuccessCallout messages={{
      "created": "domain created successfully!",
      "updated": "domain updated!"
    }} />

    <header>
      <h1 className="page-h1">{domain.origin}</h1>
      <DataGridDisplay data={{
        'redirect url': domain.redirect_url,
        'created at': new Date(domain.createdAt),
        'updated at': new Date(domain.updatedAt)
      }} />
    </header>

    <section className="category flex-row -mt-8">
      <EditFormDialog
        id={domain.id}
        name="Domain"
        context={context}
        action={async (inputs, dialogContext) => {
          "use server"
          await actionAdminOnly(`/${ project.id }`)
          const res = await updateDomain({
            project_id: inputs.project_id,
            origin: inputs.origin,
            redirect_url: inputs.origin + inputs.redirect_url,
          }, domain.id)
          actionResolveError(res, { ...inputs, ...dialogContext })
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
        searchParams={props.searchParams}
        errorCallout={<ErrorCallout<typeof updateDomain> messages={{
          missing_fields: "please fill out all required fields.",
          project_not_found: "project not found.",
          invalid_origin: "invalid origin.",
          invalid_redirect_url: "invalid redirect url.",
          mismatched_domains: "callback and redirect urls must share the same domain.",
          insecure_origin: "origin must use https unless using localhost.",
          insecure_redirect_url: "redirect url must use https unless using localhost.",
          domain_exists: "domain already exists for this project.",
          domain_in_use: `domain is already in use by another project: $1`,
        }} />}
      />
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
  </>
}






async function ProjectKeysList(props: {
  projectid: string,
  searchParams?: PageSearchParams
}) {

  const { projectid } = props
  const { project, error } = await pageData.projectPage2(projectid)
  if (error) return null
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const project_keys = await getAllProjectKeys(projectid)

  return (
    <section className="category">
      <div className="category-header">
        secret keys ↓
        <p className="text-xxs">
          you can create multiple keys for different environments (e.g. development, staging, production).
          this will be used to validate requests to /token endpoints.
        </p>
      </div>

      <ul className="list">
        {project_keys.length === 0 && <div className="list-empty">No API keys present</div>}
        {project_keys.map(key =>
          <li className="relative group" key={key.id}>
            <SubPage name={`key_${ key.id }`} children={subpage => <>
              <subpage.Button>
                <button className="list-row">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="text-foreground-body font-semibold leading-3 text-xs">
                      🔑 {key.name}
                      <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                        {' - '}<DateTime date={key.createdAt} />
                      </span>
                    </div>
                    <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0">
                      {key.client_secret}
                    </div>
                  </div>
                </button>
              </subpage.Button>

              <subpage.Content>
                <ProjectKeySubpage
                  context={{ [`key_${ key.id }`]: '' }}
                  keyid={key.id}
                  projectid={project.id}
                  searchParams={props.searchParams ?? {}}
                />
              </subpage.Content>
            </>} />


            <div className="absolute top-1 right-1">
              <CopyButton text={key.client_secret} className="button small floating opacity-0 group-hover:opacity-100">
                copy
              </CopyButton>
            </div>
          </li>
        )}
      </ul>

      <Dialog name="add_key" children={dialog => <>
        <dialog.Button className="button small">
          <IconAdd className="icon" /> Create Secret Key
        </dialog.Button>

        <dialog.Content wide>
          <DialogTitle>Create Secret Key</DialogTitle>
          <p className="mb-4 -mt-3">
            Project keys are used to authorize your application to use the authentication services.
          </p>
          <form.CreateForm
            name="Create Project Key"
            action={async inputs => {
              "use server"
              await actionAdminOnly(`/${ project.id }`)
              const res = await createProjectKey(inputs)
              actionResolveError(res, { ...inputs, ...dialog.context })
              revalidatePath(`/${ project.id }`)
              actionNavigate(`/${ project.id }?success=key_added`)
            }}
            fields={{
              name: {
                type: "text",
                label: "Key Name",
                placeholder: "My Secret Key",
                required: true,
              },
              project_id: {
                type: 'readonly',
                value: project.id,
              },
            }}
            searchParams={props.searchParams}
            errorCallout={<ErrorCallout<typeof createProjectKey> messages={{
              missing_fields: "missing required fields.",
              project_not_found: "project not found.",
            }} />}
          />
        </dialog.Content>
      </>} />
    </section>
  )
}



async function ProjectKeySubpage(props: {
  projectid: string,
  keyid: string,
  context?: PageContext,
  searchParams: PageSearchParams
}) {

  const { projectid, keyid, context } = props
  const { key, project, error } = await pageData.projectKeyPage2(projectid, keyid)
  if (error) return error

  return <>
    <SuccessCallout messages={{
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <header>
      <h1 className="page-h1">{key.name}</h1>
      <DataGridDisplay data={{
        'key secret': key.client_secret,
        'created at': key.createdAt,
        'updated at': key.updatedAt
      }} />
    </header>

    <div className="flex gap-2 -mt-8 flex-wrap">
      <CopyButton className="button primary small" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <Form action={async () => {
        "use server"
        await actionAdminOnly(`/${ project.id }`)
        const res = await regenerateProjectKeySecret(key.id)
        actionResolveError(res, context)
        revalidatePath(`/${ project.id }`)
        actionNavigate(`/${ project.id }?success=updated`, "replace", context)
      }}>
        <FormButton className="button small" loading="Regenerating...">
          Regenerate Secret <div className="icon-end">🔄</div>
        </FormButton>
      </Form>
      <EditFormDialog
        id={key.id}
        name="Domain"
        context={context}
        action={async (inputs, dialogContext) => {
          "use server"
          await actionAdminOnly(`/${ project.id }`)
          const res = await updateProjectKey(inputs, key.id)
          actionResolveError(res, { ...inputs, ...dialogContext })
          revalidatePath(`/${ project.id }`)
          actionNavigate(`/${ project.id }?success=updated`, "replace", context)
        }}
        fields={{
          name: {
            label: "key name",
            type: "text",
            defaultValue: key.name,
            helper: "describe your project key to differentiate with other keys",
            required: true,
          },
          project_id: {
            type: 'readonly',
            value: project.id,
          }
        }}
        searchParams={props.searchParams}
        errorCallout={<ErrorCallout<typeof updateProjectKey> messages={{
          missing_fields: "please fill out all required fields.",
          not_found: "project key not found.",
          project_not_found: "project not found.",
        }} />}
      />
      <DeleteDialogButton
        name={`project-key-${ key.id }`}
        context2={context}
        label="Delete Project Key"
        alertTitle="Are you sure you want to permanently delete this project key?"
        alertDescription="This action cannot be undone. Any applications using this key will no longer be able to access the project."
        action={async () => {
          "use server"
          await actionAdminOnly()
          const res = await deleteProjectKey(key.id)
          actionResolveError(res, { delete: 'show' })
          revalidatePath(`/${ project.id }`)
          actionNavigate(`/${ project.id }?success=domain_deleted`)
        }}
      />
    </div>
  </>

}