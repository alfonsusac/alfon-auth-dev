import { adminOnly } from "@/lib/auth"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import { CopyButton } from "@/lib/CopyButton"
import { deleteProjectKey, getProject, regenerateProjectKeySecret, updateProjectKey } from "@/services/projects"
import { form } from "@/lib/AppForm"
import { Form } from "@/lib/basic-form/Form"
import { triggerSuccessBanner } from "@/lib/toast/trigger"
import { ErrorCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { Link } from "@/lib/Link"
import { DeleteDialogButton } from "@/lib/DeleteDialog"
import { navigate } from "@/lib/resolveAction"

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
      <CopyButton className="button primary small" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <Form action={async () => {
        "use server"
        await adminOnly(`/${ projectid }`)
        const res = await regenerateProjectKeySecret(key.id)
        resolveError(`/${ projectid }/key/${ key.id }`, res)
        revalidatePath(`/${ projectid }`, 'layout')
        triggerSuccessBanner("updated")
      }}>
        <FormButton className="button small" loading="Regenerating...">
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
          triggerSuccessBanner("updated")
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
        searchParams={await props.searchParams}
        errorCallout={<ErrorCallout<typeof updateProjectKey> messages={{
          missing_fields: "please fill out all required fields.",
          not_found: "project key not found.",
          project_not_found: "project not found.",
        }} />}
      />
    </section>

    <section className="category">
      <p className="category-title">danger zone ↓</p>

      <DeleteDialogButton
        label="Delete Project Key"
        searchParams={await props.searchParams}
        alertTitle="Are you sure you want to permanently delete this project key?"
        alertDescription="This action cannot be undone. Any applications using this key will no longer be able to access the project."
        action={async () => {
          "use server"
          await adminOnly()
          const res = await deleteProjectKey(key.id)
          resolveError(`/${ projectid }/key/${ key.id }`, res)
          revalidatePath(`/${ projectid }`)
          navigate(`/${ projectid }?success=key_deleted`)
        }}
      />
    </section>

  </>
}

