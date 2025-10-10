import { actionAdminOnly } from "@/lib/auth"
import { CopyButton } from "@/lib/CopyButton"
import { DataGridDisplay } from "@/lib/DataGrid"
import { actionResolveError } from "@/lib/redirects"
import { navigate } from "@/lib/resolveAction"
import { SuccessCallout } from "@/lib/toast/search-param-toast.client"
import { regenerateProjectKeySecret, deleteProjectKey } from "@/services/projects"
import { DeleteButton } from "@/shared/dialog-delete"
import type { ProjectKeyProp, ProjectProp } from "../types"
import { ActionButton, Form } from "@/lib/formv2/form-component"
import { editProjectKeyForm } from "./project-key-edit-form"
import { route } from "../routes"
import { searchParams } from "@/lib/page"
import { Title } from "@/lib/primitives"
import { EditFormDialog } from "@/shared/dialog-edit"

export async function ProjectKeySubpage({ project, projectKey, context }:
  & ProjectProp
  & ProjectKeyProp
  & PageContextProp
) {
  const key = projectKey
  const sp = await searchParams()
  return <>
    <SuccessCallout messages={{
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <Title>{key.name}</Title>
    <DataGridDisplay data={{
      'key secret': key.client_secret,
      'created at': key.createdAt,
      'updated at': key.updatedAt
    }} />

    <div className="flex gap-2 -mt-8 flex-wrap">
      <CopyButton className="button primary small" text={key.client_secret}>
        Copy Key
      </CopyButton>
      <ActionButton
        action={async () => {
          "use server"
          await actionAdminOnly(`/${ project.id }`)
          const res = await regenerateProjectKeySecret(key.id)
          actionResolveError(res, context)
          navigate.replace(route.projectPage(project.id), { success: 'updated' }, context)
        }}
        loading="Regenerating..."
      >
        Regenerate Secret <div className="icon-end">🔄</div>
      </ActionButton>
    </div>
    <EditFormDialog
      name={'Domain'}
      context={context}
    >
      {dialog => <Form
        form={editProjectKeyForm(project, projectKey)}
        onSubmit={async () => {
          'use server'
          navigate.replace(route.projectPage(project.id), { success: 'updated' }, context)
        }}
        searchParams={sp}
      />}
    </EditFormDialog>
    <DeleteButton
      name={`project-key-${ key.id }`}
      context={context}
      label="Delete Project Key"
      alertTitle="Are you sure you want to permanently delete this project key?"
      alertDescription="This action cannot be undone. Any applications using this key will no longer be able to access the project."
      action={async () => {
        "use server"
        await actionAdminOnly()
        const res = await deleteProjectKey(key.id)
        actionResolveError(res, context)
        navigate.replace(route.projectPage(project.id), { success: 'domain_deleted' }, context)
      }}
    />
  </>

} 