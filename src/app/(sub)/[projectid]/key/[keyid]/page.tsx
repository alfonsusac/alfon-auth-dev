import { actionAdminOnly } from "@/lib/auth"
import { FormButton } from "@/lib/FormButton"
import { revalidatePath } from "next/cache"
import { CopyButton } from "@/lib/CopyButton"
import { deleteProjectKey, regenerateProjectKeySecret, updateProjectKey } from "@/services/projects"
import { form } from "@/lib/basic-form/app-form"
import { Form } from "@/lib/basic-form/form"
import { ErrorCallout, SuccessCallout } from "@/lib/toast/search-param-toast.client"
import { DeleteDialogButton } from "@/lib/dialogs/dialog-delete"
import { actionNavigate } from "@/lib/resolveAction"
import BackButton from "@/lib/BackButton"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { DataGridDisplay } from "@/lib/DataGrid"
import { pageData } from "@/app/data"
import { actionResolveError } from "@/lib/redirects"

export default async function ProjectKeyPage(props: PageProps<"/[projectid]/key/[keyid]">) {

  const { projectid, keyid, searchParams, user } = await pageData.resolve(props)
  const { project, key, error } = await pageData.projectKeyPage2(projectid, keyid)
  if (error) return error

  return <>
    <BackButton href={`/${ project.id }`}>Back to Project</BackButton>

    <SuccessCallout messages={{
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{key.name}</h1>

      <DataGridDisplay data={{
        'key secret': key.client_secret,
        'created at': key.createdAt,
        'updated at': key.updatedAt
      }} />
    </header>

    <div className="flex gap-2">
      <CopyButton className="button primary small" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <Form action={async () => {
        "use server"
        await actionAdminOnly(`/${ project.id }`)
        const res = await regenerateProjectKeySecret(key.id)
        actionResolveError(res)
        revalidatePath(`/${ project.id }`, 'layout')
        actionNavigate(`/${ project.id }?success=updated`)
      }}>
        <FormButton className="button small" loading="Regenerating...">
          Regenerate Secret <div className="icon-end">🔄</div>
        </FormButton>
      </Form>
    </div>

    <section className="category">
      <p className="category-header">edit details ↓</p>
      <form.EditForm
        name={"edit_project_key"}
        action={async (inputs) => {
          "use server"
          await actionAdminOnly(`/${ project.id }`)
          const res = await updateProjectKey(inputs, key.id)
          actionResolveError(res)
          revalidatePath(`/${ project.id }`, 'layout')
          actionNavigate(`/${ project.id }?success=updated`)
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
      <p className="category-header">danger zone ↓</p>

      <DeleteDialogButton
        name="project_key"
        label="Delete Project Key"
        alertTitle="Are you sure you want to permanently delete this project key?"
        alertDescription="This action cannot be undone. Any applications using this key will no longer be able to access the project."
        action={async () => {
          "use server"
          await actionAdminOnly()
          const res = await deleteProjectKey(key.id)
          actionResolveError(res)
          revalidatePath(`/${ project.id }`)
          actionNavigate(`/${ project.id }?success=key_deleted`)
        }}
      />
    </section>

  </>
}

