import { pageData } from "@/app/data"
import { form } from "@/lib/AppForm"
import { actionAdminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { resolveError } from "@/lib/redirects"
import { actionNavigate } from "@/lib/resolveAction"
import { ErrorCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { createDomain } from "@/services/projects"
import { revalidatePath } from "next/cache"

export default async function CreateProjectDomainPage(props: PageProps<'/[projectid]/domain/create'>) {

  const { project, error } = await pageData.projectPage(props as any)
  if (error) return error

  return <>
    <BackButton href={`/${ project.id }`}>{project.name}</BackButton>

    <header className="page-header">
      <Breadcrumb items={[project.name, "Create Domain"]} />
      <h1 className="page-h1">Add Project Domain</h1>
      <p className="text-foreground-body mt-2">
        project domains are used to restrict where your application can be used from. only requests originating from these domains will be authorized.
      </p>
    </header>

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
        const key = resolveError(`/${ project.id }/domain/create`, res, inputs)
        revalidatePath(`/${ project.id }`, 'layout')
        actionNavigate(`/${ project.id }/domain/${ key.id }?success=domain_added`)
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
      searchParams={await props.searchParams}
      errorCallout={<ErrorCallout<typeof createDomain> messages={{
        project_not_found: "project not found.",
        missing_fields: "missing required fields.",
        invalid_origin: "invalid callback url format.",
        invalid_redirect_url: "invalid redirect url format.",
        mismatched_domains: "redirect url must be on the same domain as callback url.",
        insecure_origin: "origin must use https unless using localhost.",
        insecure_redirect_url: "redirect url must use https unless using localhost.",
        domain_exists: "domain already exists for this project.",
      }} />}
    />

  </>

}
