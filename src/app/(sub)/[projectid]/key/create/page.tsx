import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { FormButton } from "@/lib/FormButton"
import { createProjectKey, getProject } from "@/services/projects"
import { redirect } from "next/navigation"
import { ProjectNotFound } from "../../shared"
import { ErrorCallout } from "@/lib/SPCallout"
import { KeyCallbackURIInputField, KeyDescriptionInputField, KeyDomainInputField } from "../form"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { getStringInputs } from "@/lib/formData"
import { navigate } from "@/lib/resolveAction"
import { Form } from "@/lib/Form"

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
      const inputs = getStringInputs(form, ["description", "domain", "callbackURI"])
      const res = await createProjectKey(param.projectid, inputs.description, inputs.domain, inputs.callbackURI)
      const key = resolveError(`/${ param.projectid }/key/create`, res, inputs)
      revalidatePath(`/${ param.projectid }`, 'layout')
      navigate(`./${ key.id }?info=new`)
    }}>

      <KeyDescriptionInputField
        name="description"
        defaultValue={sp['description']?.toString()} />
      <KeyDomainInputField
        name="domain"
        defaultValue={sp['domain']?.toString()} />
      <KeyCallbackURIInputField
        name="callbackURI"
        defaultValue={sp['callbackURI']?.toString()} />

      <ErrorCallout<typeof createProjectKey> sp={searchParams} messages={{
        not_found: "project not found.",
        invalid_domain: "invalid domain.",
        missing_fields: "missing required fields.",
        invalid_callbackURI: "invalid callback URI.",
        callbackURI_must_match_domain: "callback URI must match the domain.",
      }} />

      <FormButton className="button primary px-6 mt-4 w-30"
        loading="Creating..."
      >Create</FormButton>
    </Form>
  </>

}