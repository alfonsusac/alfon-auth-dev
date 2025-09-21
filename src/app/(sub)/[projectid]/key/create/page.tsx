import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { FormButton } from "@/lib/FormButton"
import { createProjectKey, getProject } from "@/services/projects"
import { ProjectNotFound } from "../../shared"
import { ErrorCallout } from "@/lib/SPCallout"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { getStringInputs } from "@/lib/formData"
import { navigate } from "@/lib/resolveAction"
import { Form } from "@/lib/Form"
import { KeyNameInputField } from "../form"

export default async function CreateProjectKeyPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const param = await params
  const project = await getProject(param.projectid)
  if (!project) return <ProjectNotFound id={param.projectid} />
  await adminOnly(`/${ param.projectid }`)

  const sp = await searchParams

  return <>
    <BackButton href={`/${ project.id }`}>{project.name}</BackButton>

    <header className="page-header">
      <Breadcrumb items={[project.name, "Create Key"]} />
      <h1 className="page-h1">Create Project Key</h1>
      <p className="text-foreground-body">
        Project keys are used to authorize your application to use the authentication services.
      </p>
    </header>

    <Form className="flex flex-col gap-6 max-w-80" action={async (form: FormData) => {
      "use server"
      await adminOnly(`/${ param.projectid }`)
      const inputs = getStringInputs(form, ["name", "project_id"])
      const res = await createProjectKey(inputs)
      const key = resolveError(`/${ param.projectid }/key/create`, res, inputs)
      revalidatePath(`/${ param.projectid }`, 'layout')
      navigate(`./${ key.id }?info=new`)
    }}>

      <input readOnly hidden name="project_id" value={project.id} />

      <KeyNameInputField
        name="name"
        defaultValue={sp['name']?.toString()} />

      <ErrorCallout<typeof createProjectKey> sp={searchParams} messages={{
        missing_fields: "missing required fields.",
        project_not_found: "project not found.",
      }} />

      <FormButton className="button primary px-6 mt-4 w-30"
        loading="Creating..."
      >Create</FormButton>
    </Form>
  </>

}