import { DialogCloseButton, DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/page/page"
import { actionResolveError } from "@/lib/redirects"
import { navigate } from "@/lib/navigate"
import { deleteProject } from "@/services/projects"
import { DeleteButton } from "@/shared/dialog-delete"
import { revalidatePath } from "next/cache"
import { ProjectProp } from "../types"
import { Form } from "@/lib/formv2/form-component"
import { editProjectForm } from "./project-edit-form"
import { route } from "../routes"
import { adminOnlyAction } from "@/shared/auth/admin-only"

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
              onSubmit={async () => {
                "use server"
                navigate.replace(route.projectPage(project.id), { success: "updated" }, modal.context)
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
                actionResolveError(res, { delete: '' })
                revalidatePath('/', 'layout')
                navigate.push('/?success=deleted')
              }}
            />
          </section>

        </DialogSurface>
      </>}

    />
  )
}