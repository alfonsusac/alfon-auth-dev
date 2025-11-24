import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/next/next-page"
import { ProjectProp } from "../types"
import { projectPageRoute } from "../routes"
import { navigate } from "@/module/navigation"
import { Form } from "@/module/form2"
import { createProjectKeyForm } from "@/services/project-key/forms"

export async function ProjectKeyCreateModalDialog({ project, children }:
  & ProjectProp
  & Props.Children
) {
  return (
    <Modal
      name={"create_key"}
      content={dialog => <>
        <DialogSurface wide>
          <DialogTitle>Create Secret Key</DialogTitle>
          <p className="mb-4 -mt-3">
            Project keys are used to authorize your application to use the authentication services.
          </p>
          <Form
            form={createProjectKeyForm({ project_id: project.id })}
            onSuccess={async () => {
              "use server"
              navigate.push(projectPageRoute(project.id), { success: 'key_added' })
            }}
          />
        </DialogSurface>
      </>}
    />
  )
}