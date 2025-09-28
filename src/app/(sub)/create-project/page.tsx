import { actionAdminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { form } from "@/lib/basic-form/app-form"
import { actionNavigate } from "@/lib/resolveAction"
import { ErrorCallout } from "@/lib/toast/search-param-toast.client"
import { createProject } from "@/services/projects"
import { pageData } from "@/app/data"
import { revalidatePath } from "next/cache"
import { actionResolveError } from "@/lib/redirects"

export default async function CreateProjectPage(props: PageProps<'/create-project'>) {

  const { error } = await pageData.createProjectPage()
  if (error) return error

  return <>
    <BackButton href="/">Home</BackButton>

    <header>
      <h1 className="page-h1">Create Project</h1>
    </header>

    <form.CreateForm
      name="create-project"
      fields={{
        id: {
          type: "text",
          required: true,
          label: "project id",
          helper: "will be used at the auth url",
          prefix: "auth.alfon.dev/",
          placeholder: "project_id",
        },
        name: {
          type: "text",
          required: true,
          label: "project name",
          helper: "will be used as the display of the project",
          placeholder: "My Project",
        },
      }}
      action={async (inputs) => {
        "use server"
        await actionAdminOnly()
        const res = await createProject(inputs)
        actionResolveError(res, inputs)
        revalidatePath('/', "layout")
        actionNavigate(`/${ inputs.id }?success=created`)
      }}
      errorCallout={
        <ErrorCallout<typeof createProject> messages={{
          id_exists: "project id already exists.",
          missing_fields: "missing required fields.",
          invalid_id: "project id can only contain alphanumeric characters, dashes and underscores.",
        }} />
      }
      searchParams={await props.searchParams}
    />
  </>

}