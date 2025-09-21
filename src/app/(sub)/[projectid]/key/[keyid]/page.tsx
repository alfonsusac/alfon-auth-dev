import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import prisma from "@/lib/db"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { getProjectWithKeys, updateProjectKey } from "@/services/projects"
import { revalidatePath } from "next/cache"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import { ErrorCallout, SPCallout } from "@/lib/SPCallout"
import { KeyCallbackURIInputField, KeyDescriptionInputField, KeyDomainInputField } from "../form"
import { formatDate } from "@/lib/date"
import { getStringInputs } from "@/lib/formData"
import { redirect, RedirectType } from "next/navigation"
import { CopyButton, copyButtonAction } from "@/lib/CopyButton"
import { Form } from "@/lib/Form"
import { navigate } from "@/lib/resolveAction"

export default async function ProjectKeyPage(props: {
  params: Promise<{ projectid: string, keyid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const projectid = params.projectid
  await adminOnly(`/${ projectid }`)

  const project = await getProjectWithKeys(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const key = project.ProjectKey.find(k => k.id === params.keyid)
  if (!key) return <ProjectKeyNotFound key_id={params.keyid} project_id={projectid} />

  return <>
    <BackButton href={`/${ projectid }`}>Back to Project</BackButton>

    <SPCallout sp={props.searchParams} match="info=new" className="success">key created successfully!</SPCallout>
    <SPCallout sp={props.searchParams} match="info=updated" className="success">key updated!</SPCallout>

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{key.description}</h1>
      <code className="page-subtitle-code">key secret: {key.key}</code>
      <p className="page-subtitle ">Created: {formatDate(key.createdAt)}</p>
    </header>

    <CopyButton className="button primary" text={key.key}>
      Copy Key
    </CopyButton>

    <section className="category">
      <p className="category-title">edit details ↓</p>
      <hr />
      {/* <form className="flex flex-col gap-6"
        action={async (form: FormData) => {
          "use server"
          await adminOnly(`/${ projectid }`)
          const inputs = getStringInputs(form, ["description", "domain", "callbackURI"])
          console.log(inputs)
          const res = await updateProjectKey(key.id, inputs)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`, 'layout')
          redirect(`/${ projectid }/key/${ key.id }?info=updated`)
        }}
      > */}
      <Form className="flex flex-col gap-6"
        action={async (form: FormData) => {
          "use server"
          await adminOnly(`/${ projectid }`)
          const inputs = getStringInputs(form, ["description", "domain", "callbackURI"])
          const res = await updateProjectKey(key.id, inputs)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`, 'layout')
          navigate(`?info=updated`, "replace")
        }}
      >
        <KeyDescriptionInputField
          name="description"
          defaultValue={key.description} />
        <KeyDomainInputField
          name="domain"
          defaultValue={key.domain} />
        <KeyCallbackURIInputField
          name="callbackURI"
          defaultValue={key.callbackURI} />

        <ErrorCallout<typeof updateProjectKey> sp={props.searchParams} messages={{
          not_found: "project not found.",
          invalid_domain: "invalid domain.",
          invalid_callbackURI: "invalid callback URI.",
          callbackURI_must_match_domain: "callback URI must match the domain.",
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

