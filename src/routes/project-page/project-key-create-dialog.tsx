import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/next/next-page"
import { ProjectProp } from "../types"
import { createProjectKeyForm } from "./project-key-create-form"
import { projectPageRoute } from "../routes"
import { navigate } from "@/module/navigation"
import { Form } from "@/module/form"

export async function ProjectKeyCreateModalDialog({ project, children }:
  & ProjectProp
  & Props.Children
) {
  const sp = await searchParams()
  return (
    <Modal
      name={"create_key"}
      button={Button => children}
      content={dialog => <>
        <DialogSurface wide>
          <DialogTitle>Create Secret Key</DialogTitle>
          <p className="mb-4 -mt-3">
            Project keys are used to authorize your application to use the authentication services.
          </p>
          <Form
            form={createProjectKeyForm(project)}
            onSuccess={async () => {
              "use server"
              navigate.push(projectPageRoute(project.id), { success: 'key_added' })
            }}
            searchParams={sp}
          />
        </DialogSurface>
      </>}
    />
  )
}