import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { ModalContent } from "@/lib/dialogsv2/modal.client"
import { Props } from "@/lib/next/next-page"
import { ProjectProp } from "../types"
import { Form } from "@/module/form"
import { addProjectDomainForm } from "./project-domain-add-form"
import { navigate } from "@/module/navigation"
import { projectPageRoute } from "../routes"

export async function ProjectDomainAddModalDialog({ project, children }:
  & ProjectProp
  & Props.Children
) {
  return (
    <Modal
      name="add_url"
      button={() => children}
      content={dialog => <>
        <DialogSurface wide>
          <DialogTitle>Add Project URL</DialogTitle>
          <Form
            form={addProjectDomainForm(project)}
            onSuccess={async () => {
              "use server"
              navigate.push(projectPageRoute(project.id), { success: 'domain_added' }, dialog.context)
            }}
          />
        </DialogSurface>
      </>}
    />
  )
}