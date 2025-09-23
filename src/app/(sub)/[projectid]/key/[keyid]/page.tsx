import { adminOnly } from "@/lib/auth"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import { CopyButton } from "@/lib/CopyButton"
import { navigateWithSuccess } from "@/lib/resolveAction"
import { getProject, regenerateProjectKeySecret, updateProjectKey } from "@/services/projects"
import { form } from "@/lib/FormBasic"
import { Form } from "@/lib/basic-form/Form"

export default async function ProjectKeyPage(props: PageProps<"/[projectid]/key/[keyid]">) {
  const params = await props.params
  const projectid = params.projectid
  await adminOnly(`/${ projectid }`)

  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const key = (await project.keys()).find(k => k.id === params.keyid)
  if (!key) return <ProjectKeyNotFound key_id={params.keyid} project_id={projectid} />


  return <>
    {/* Header in layout.tsx */}

    <div className="flex gap-2">
      <CopyButton className="button primary" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <Form action={async () => {
        "use server"
        console.log("A")
        await adminOnly(`/${ projectid }`)
        const res = await regenerateProjectKeySecret(key.id)
        resolveError(`/${ projectid }/key/${ key.id }`, res)
        revalidatePath(`/${ projectid }`, 'layout')
        navigateWithSuccess(``, "key_updated")
      }}>
        <FormButton className="button" loading="Regenerating...">
          Regenerate Secret <div className="icon-end">🔄</div>
        </FormButton>
      </Form>
    </div>

    <section className="category">
      <p className="category-title">edit details ↓</p>
      <form.EditForm
        name={"edit_project_key"}
        action={async (inputs) => {
          "use server"
          await adminOnly(`/${ projectid }`)
          const res = await updateProjectKey(inputs, key.id)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`, 'layout')
          navigateWithSuccess(``, "key_updated")
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

