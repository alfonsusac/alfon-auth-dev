import { pageData } from "@/app/data"
import { actionAdminOnly } from "@/lib/auth"
import { EditFormDialog } from "@/lib/basic-form/app-form-dialog"
import { RootForm } from "@/lib/basic-form/form"
import { CopyButton } from "@/lib/CopyButton"
import { DataGridDisplay } from "@/lib/DataGrid"
import { DeleteDialogButton } from "@/lib/dialogs/dialog-delete"
import { FormButton } from "@/lib/FormButton"
import { actionResolveError } from "@/lib/redirects"
import { actionNavigate } from "@/lib/resolveAction"
import { SuccessCallout, ErrorCallout } from "@/lib/toast/search-param-toast.client"
import { regenerateProjectKeySecret, updateProjectKey, deleteProjectKey, deleteDomain, updateDomain } from "@/services/projects"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export async function ProjectKeySubpage(props: {
  projectid: string,
  keyid: string,
  context?: PageContext,
  searchParams: PageSearchParams
}) {

  const { projectid, keyid, context } = props
  const { key, project, error } = await pageData.projectKeyPage(projectid, keyid)
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
      <RootForm action={async () => {
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
      </RootForm>
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
        context={context}
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


export async function ProjectDomainSubpage(props: {
  projectid: string,
  domainid: string,
  context?: PageContext,
  searchParams: PageSearchParams
}) {

  const { projectid, domainid, context } = props
  const { domain, project, error } = await pageData.projectDomainPage(projectid, domainid)
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
        context={context}

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




