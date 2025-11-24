import { DialogCloseButton, DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/next/next-page"
import { DeleteButton } from "@/module/dialogs/dialog-delete"
import { ProjectProp } from "../types"
import { navigate } from "@/module/navigation"
import { projectPageRoute } from "../routes"
import { deleteProjectAction } from "@/services/project/actions"
import { Form } from "@/module/form"
import { updateProjectForm } from "@/services/project/forms"
import { bindAction } from "@/lib/core/action"

export async function ProjectSettingsModal({ project, children }:
  & ProjectProp
  & Props.Children
) {
  return (
    <Modal
      name={`project_setting_${ project.id }`}
      content={modal => <>
        <DialogSurface wider>
          <DialogCloseButton />
          <h2 className="page-h2">Project Settings</h2>
          <section className="category">
            <h3 className="category-header">project details ↓</h3>
            <Form
              form={updateProjectForm(project.id)()}
              onSuccess={async () => {
                "use server"
                navigate.replace(projectPageRoute(project.id), { success: "updated" }, modal.context)
              }}
            />
          </section>

          <section className="category">
            <h3 className="category-header">danger zone ↓</h3>
            <DeleteButton
              context={modal.context}
              name={`project-${ project.id }`}
              what="Project"
              alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
              action={bindAction(deleteProjectAction, project.id)}
            />
          </section>

        </DialogSurface>
      </>}

    />
  )
}