import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import { ErrorCallout, SPCallout } from "@/lib/SPCallout"
import { KeyNameInputField } from "../form"
import { formatDate } from "@/lib/date"
import { getStringInputs } from "@/lib/formData"
import { CopyButton } from "@/lib/CopyButton"
import { Form } from "@/lib/Form"
import { navigate } from "@/lib/resolveAction"
import { getProject, updateProjectKey } from "@/services/projects"

export default async function ProjectKeyPage(props: {
  params: Promise<{ projectid: string, keyid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const projectid = params.projectid
  await adminOnly(`/${ projectid }`)

  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const key = (await project.keys()).find(k => k.id === params.keyid)
  if (!key) return <ProjectKeyNotFound key_id={params.keyid} project_id={projectid} />

  return <>
    <BackButton href={`/${ projectid }`}>Back to Project</BackButton>

    <SPCallout sp={props.searchParams} match="info=new" className="success">key created successfully!</SPCallout>
    <SPCallout sp={props.searchParams} match="info=updated" className="success">key updated!</SPCallout>

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{key.name}</h1>
      <code className="page-subtitle-code">key secret: {key.client_secret}</code>
      <p className="page-subtitle ">Created: {formatDate(key.createdAt)}</p>
    </header>

    <CopyButton className="button primary" text={key.client_secret}>
      Copy Key
    </CopyButton>

    <section className="category">
      <p className="category-title">edit details ↓</p>
      <hr />
      <Form className="flex flex-col gap-6"
        action={async (form: FormData) => {
          "use server"
          await adminOnly(`/${ projectid }`)
          const inputs = getStringInputs(form, ["name", "project_id"])
          const res = await updateProjectKey(inputs, key.id)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`, 'layout')
          navigate(`?info=updated`, "replace")
        }}
      >
        <input readOnly hidden name="project_id" value={project.id} />

        <KeyNameInputField
          name="name"
          defaultValue={key.name} />

        <ErrorCallout<typeof updateProjectKey> sp={props.searchParams} messages={{
          not_found: "project key not found.",
          project_not_found: "project not found.",
          missing_fields: "some fields are missing.",
        }} />

        <FormButton className="button primary px-6 self-end"
          loading="Saving..."
          type="submit"
        >Save</FormButton>
      </Form>
    </section>

    <section className="category">
      <p className="category-title">danger zone ↓</p>
      <hr />
      <a className="button destructive"
        href={`/${ projectid }/key/${ key.id }/delete`}>
        Delete Project Key
      </a>
    </section>

  </>




}

