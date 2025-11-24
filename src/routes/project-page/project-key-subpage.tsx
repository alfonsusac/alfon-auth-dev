import { CopyButton } from "@/lib/CopyButton"
import { DataGridDisplay } from "@/lib/DataGrid"
import { DeleteButton } from "@/module/dialogs/dialog-delete"
import type { ProjectKeyProp, ProjectProp } from "../types"
import { searchParams } from "@/lib/next/next-page"
import { Header, Row, Title } from "@/lib/primitives"
import { EditFormDialogButton } from "@/module/dialogs/dialog-edit"
import { adminOnlyAction } from "@/shared/auth/admin-only"
import { DetailPage } from "@/lib/page-templates"
import { navigate } from "@/module/navigation"
import { isError } from "@/module/action/error"
import { resolveAction } from "@/module/action/action"
import { deleteProjectKey, regenerateProjectKeySecret } from "@/services/project/db"
import { projectPageRoute } from "../routes"
import { ActionButton } from "@/module/button"
import { editProjectKeyForm } from "@/services/project-key/forms"
import { deleteProjectKeyAction } from "@/services/project-key/actions"
import { bindAction } from "@/lib/core/action"

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
            if (isError(res)) resolveAction.error(res, context)
            resolveAction.success('replace', projectPageRoute(project.id), 'updated', context)
          }}
          loading="Regenerating..."
        >
          Regenerate Secret <div className="icon-end">🔄</div>
        </ActionButton>
        <EditFormDialogButton
          name={'Key'}
          context={context}
          form={editProjectKeyForm({ project_id: project.id, project_key_id: key.id })}
          onSuccess={async () => {
            'use server'
            navigate.replace(projectPageRoute(project.id), { success: 'updated' }, context)
          }}
        />
        <DeleteButton
          name={`project-key-${ key.id }`}
          context={context}
          label="Delete Project Key"
          alertTitle="Are you sure you want to permanently delete this project key?"
          alertDescription="This action cannot be undone. Any applications using this key will no longer be able to access the project."
          action={bindAction(deleteProjectKeyAction, key.id)}
        />
      </Row>
    </Header>

  </DetailPage>

} 