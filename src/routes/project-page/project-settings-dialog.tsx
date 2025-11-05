import { DialogCloseButton, DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/next/next-page"
import { DeleteButton } from "@/shared/dialog-delete"
import { revalidatePath } from "next/cache"
import { ProjectProp } from "../types"
import { editProjectForm } from "./project-edit-form"
import { adminOnlyAction } from "@/shared/auth/admin-only"
import { navigate } from "@/module/navigation"
import { isError } from "@/module/action/error"
import { action } from "@/module/action/action"
import { projectPageRoute } from "../routes"
import { Form } from "@/module/form"
import { deleteProject } from "@/services/project/db"

export async function ProjectSettingsModal({ project, children }:
  & ProjectProp
  & Props.Children
) {
  const sp = await searchParams()
  return (
    <Modal
      name={`project_setting_${ project.id }`}
      button={Button => children}
      content={modal => <>
        <DialogSurface wider>
          <DialogCloseButton />
          <h2 className="page-h2">Project Settings</h2>
          <section className="category">
            <h3 className="category-header">project details ↓</h3>
            <Form
              form={editProjectForm(project)}
              onSuccess={async () => {
                "use server"
                navigate.replace(projectPageRoute(project.id), { success: "updated" }, modal.context)
              }}
              searchParams={sp}
            />
          </section>

          <section className="category">
            <h3 className="category-header">danger zone ↓</h3>
            <DeleteButton
              context={modal.context}
              name={`project-${ project.id }`}
              what="Project"
              alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
              action={async () => {
                "use server"
                await adminOnlyAction()
                const res = await deleteProject(project.id)
                if (isError(res))
                  action.error(res, modal.context)
                navigate.push('/?success=deleted')
              }}
            />
          </section>

        </DialogSurface>
      </>}

    />
  )
}