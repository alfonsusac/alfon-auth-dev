import { CopyButton } from "@/lib/CopyButton"
import { DataGridDisplay } from "@/lib/DataGrid"
import { DeleteButton } from "@/shared/dialog-delete"
import type { ProjectKeyProp, ProjectProp } from "../types"
import { editProjectKeyForm } from "./project-key-edit-form"
import { searchParams } from "@/lib/next/next-page"
import { Header, Row, Title } from "@/lib/primitives"
import { EditFormDialog } from "@/shared/dialog-edit"
import { adminOnlyAction } from "@/shared/auth/admin-only"
import { DetailPage } from "@/lib/page-templates"
import { navigate } from "@/module/navigation"
import { isError } from "@/module/action/error"
import { action } from "@/module/action/action"
import { ActionButton, Form } from "@/module/form"
import { deleteProjectKey, regenerateProjectKeySecret } from "@/services/project/db"
import { projectPageRoute } from "../routes"

export async function ProjectKeySubpage({ project, projectKey, context }:
  & ProjectProp
  & ProjectKeyProp
  & PageContextProp
) {
  const key = projectKey
  const sp = await searchParams()
  return <DetailPage toasts={{
    "created": "key created successfully!",
    "updated": "key updated!"
  }}>
    <Header>
      <Title>{key.name}</Title>
      <DataGridDisplay data={{
        'key secret': key.client_secret,
        'created at': new Date(key.createdAt),
        'updated at': new Date(key.updatedAt)
      }} />
      <Row>
        <CopyButton className="button primary small" text={key.client_secret}>
          Copy Key
        </CopyButton>
        <ActionButton
          className="small"
          action={async () => {
            "use server"
            await adminOnlyAction()
            const res = await regenerateProjectKeySecret(key.id)
            if (isError(res)) action.error(res, context)
            action.success('replace', projectPageRoute(project.id), 'updated', context)
          }}
          loading="Regenerating..."
        >
          Regenerate Secret <div className="icon-end">🔄</div>
        </ActionButton>
        <EditFormDialog
          name={'Key'}
          context={context}
        >
          {dialog => <Form
            form={editProjectKeyForm(project, projectKey)}
            onSuccess={async () => {
              'use server'
              navigate.replace(projectPageRoute(project.id), { success: 'updated' }, context)
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
            await adminOnlyAction()
            const res = await deleteProjectKey(key.id)
            if (isError(res)) action.error(res, context)
            navigate.replace(projectPageRoute(project.id), { success: 'domain_deleted' }, context)
          }}
        />
      </Row>
    </Header>

  </DetailPage>

} 