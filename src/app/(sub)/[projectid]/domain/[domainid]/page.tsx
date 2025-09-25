import { pageData } from "@/app/data"
import { form } from "@/lib/AppForm"
import { actionAdminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { DataGridDisplay } from "@/lib/DataGrid"
import { DeleteDialogButton } from "@/lib/dialogs/DeleteDialog"
import { resolveError } from "@/lib/redirects"
import { actionNavigate } from "@/lib/resolveAction"
import { ErrorCallout, SuccessCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { triggerSuccessBanner } from "@/lib/toast/trigger"
import { deleteDomain, updateDomain } from "@/services/projects"
import { revalidatePath } from "next/cache"

export default async function ProjectDomainPage(props: PageProps<'/[projectid]/domain/[domainid]'>) {

  const { project, domain, error } = await pageData.projectDomainPage(props)
  if (error) return error

  return <>
    <BackButton href={`/${ project.id }`}>Back to Project</BackButton>

    <SuccessCallout messages={{
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{domain.origin}</h1>

      <DataGridDisplay data={{
        'redirect url': domain.redirect_url,
        'created at': domain.createdAt,
        'updated at': domain.updatedAt
      }} />
    </header>

    <section className="category">
      <p className="category-title">edit details ↓</p>
      <form.EditForm
        name={"edit_project_key"}
        action={async (inputs) => {
          "use server"
          await actionAdminOnly(`/${ project.id }`)
          const res = await updateDomain({
            project_id: inputs.project_id,
            origin: inputs.origin,
            redirect_url: inputs.origin + inputs.redirect_url,
          }, domain.id)
          resolveError(`/${ project.id }/key/${ domain.id }`, res)
          revalidatePath(`/${ project.id }`, 'layout')
          triggerSuccessBanner("updated")
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
        searchParams={await props.searchParams}
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
    </section>

    <section className="category">
      <p className="category-title">danger zone ↓</p>

      <DeleteDialogButton
        searchParams={await props.searchParams}
        label="Delete Project Domain"
        alertTitle="Are you sure you want to permanently delete this domain?"
        alertDescription="This action cannot be undone. Any applications using this domain will no longer be able to access the project."
        action={async () => {
          "use server"
          await actionAdminOnly()
          const res = await deleteDomain(domain.id)
          resolveError(`/${ project.id }/key/${ domain.id }`, res)
          revalidatePath(`/${ project.id }`)
          actionNavigate(`/${ project.id }?success=domain_deleted`)
        }}
      />
    </section>
  </>
} 