import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { createProjectKey, getProject } from "@/services/projects"
import { ProjectNotFound } from "../../shared"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { navigateWithSuccess } from "@/lib/resolveAction"
import { form } from "@/lib/AppForm"
import { ErrorCallout } from "@/lib/toast/SearchParamsCalloutClient"

export default async function CreateProjectKeyPage(props: PageProps<'/[projectid]/key/create'>) {
  const param = await props.params
  const project = await getProject(param.projectid)
  if (!project) return <ProjectNotFound id={param.projectid} />
  await adminOnly(`/${ param.projectid }`)

  return <>
    <BackButton href={`/${ project.id }`}>{project.name}</BackButton>

    <header className="page-header">
      <Breadcrumb items={[project.name, "Create Key"]} />
      <h1 className="page-h1">Create Secret Key</h1>
      <p className="text-foreground-body">
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
        await adminOnly(`/${ param.projectid }`)
        const res = await createProjectKey(inputs)
        const key = resolveError(`/${ param.projectid }/key/create`, res, inputs)
        revalidatePath(`/${ param.projectid }`, 'layout')
        navigateWithSuccess(`../${ key.id }`, 'created')
      }}
      searchParams={await props.searchParams}
      errorCallout={<ErrorCallout<typeof createProjectKey> messages={{
        missing_fields: "missing required fields.",
        project_not_found: "project not found.",
      }} />}
    />
  </>

}