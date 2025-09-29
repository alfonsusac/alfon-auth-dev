import { pageData } from "@/app/data"
import { actionAdminOnly } from "@/lib/auth"
import { form } from "@/lib/basic-form/app-form"
import { EditFormDialog } from "@/lib/basic-form/app-form-dialog"
import { DataGridDisplay } from "@/lib/DataGrid"
import { Dialog, DialogTitle } from "@/lib/dialogs/dialog"
import { DeleteDialogButton } from "@/lib/dialogs/dialog-delete"
import { actionResolveError } from "@/lib/redirects"
import { actionNavigate } from "@/lib/resolveAction"
import { SuccessCallout, ErrorCallout } from "@/lib/toast/search-param-toast.client"
import { updateDomain, deleteDomain } from "@/services/projects"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export async function ProjectDomainItemSubpage(props: {
  projectid: string,
  domainid: string,
  context?: PageContext,
  searchParams: PageSearchParams
}) {

  const { projectid, domainid, context } = props
  const { domain, project, error } = await pageData.projectDomainPage2(projectid, domainid)
  if (error) return error

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