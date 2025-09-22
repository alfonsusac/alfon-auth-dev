import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import { SPCallout } from "@/lib/SearchParamsCallout"
import { formatDate } from "@/lib/date"
import { CopyButton } from "@/lib/CopyButton"
import { Form } from "@/lib/Form"
import { navigate } from "@/lib/resolveAction"
import { getProject, regenerateProjectKeySecret, updateProjectKey } from "@/services/projects"
import { form } from "@/lib/FormBasic"

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

      <div className="grid grid-cols-[auto_1fr] page-subtitle mt-3 gap-1 gap-x-4">

        <div className="opacity-50">key secret</div>
        <div>{key.client_secret}</div>

        <div className="opacity-50">created at</div>
        <div>{formatDate(key.createdAt)}</div>

        <div className="opacity-50">updated at</div>
        <div>{formatDate(key.updatedAt)}</div>

      </div>
    </header>

    <div className="flex gap-2">
      <CopyButton className="button primary" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <Form action={async () => {
        "use server"
        await adminOnly(`/${ projectid }`)
        const res = await regenerateProjectKeySecret(key.id)
        resolveError(`/${ projectid }/key/${ key.id }`, res)
        revalidatePath(`/${ projectid }`, 'layout')
        navigate(`./${ key.id }?info=updated`, "replace")
      }}>
        <FormButton className="button" loading="Regenerating...">
          Regenerate Secret <div className="icon-end">🔄</div>
        </FormButton>
      </Form>
    </div>

    <section className="category">
      <p className="category-title">edit details ↓</p>

      <form.EditForm
        name={"edit project key"}
        action={async (inputs) => {
          "use server"
          await adminOnly(`/${ projectid }`)
          const res = await updateProjectKey(inputs, key.id)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`, 'layout')
          navigate(`?info=updated`, "replace")
        }}
        fields={{
          name: {
            label: "key name",
            type: "text",
            defaultValue: key.name,
            helper: "describe your project key to differentiate with other keys",
            required: true,
          },
          project_id: {
            type: 'readonly',
            value: project.id,
          }
        }}
      />
    </section>

    <section className="category">
      <p className="category-title">danger zone ↓</p>
      <a className="button destructive"
        href={`/${ projectid }/key/${ key.id }/delete`}>
        Delete Project Key
      </a>
    </section>

  </>




}

