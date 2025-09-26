import { actionAdminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { createProjectKey } from "@/services/projects"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { actionNavigate } from "@/lib/resolveAction"
import { form } from "@/lib/basic-form/AppForm"
import { ErrorCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { pageData } from "@/app/data"

export default async function CreateProjectKeyPage(props: PageProps<'/[projectid]/key/create'>) {

  const { project, error } = await pageData.projectPage(props as any)
  if (error) return error

  return <>
    <BackButton href={`/${ project.id }`}>{project.name}</BackButton>

    <header className="page-header">
      <Breadcrumb items={[project.name, "Create Key"]} />
      <h1 className="page-h1">Create Secret Key</h1>
      <p className="text-foreground-body mt-2">
        Project keys are used to authorize your application to use the authentication services.
      </p>
    </header>

    <form.CreateForm
      name="Create Project Key"
      fields={{
        name: {
          label: "Key Name",
          placeholder: "My Secret Key",
          type: "text",
          required: true,
        },
        project_id: {
          type: 'readonly',
          value: project.id,
        },
      }}
      action={async (inputs) => {
        "use server"
        await actionAdminOnly(`/${ project.id }`)
        const res = await createProjectKey(inputs)
        const key = resolveError(`/${ project.id }/key/create`, res, inputs)
        revalidatePath(`/${ project.id }`, 'layout')
        actionNavigate(`/${ project.id }/key/${ key.id }?success=created`)
      }}
      searchParams={await props.searchParams}
      errorCallout={<ErrorCallout<typeof createProjectKey> messages={{
        missing_fields: "missing required fields.",
        project_not_found: "project not found.",
      }} />}
    />
  </>

}