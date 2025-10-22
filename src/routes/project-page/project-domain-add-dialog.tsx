import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { ModalContent } from "@/lib/dialogsv2/modal.client"
import { Props } from "@/lib/page/page"
import { navigate } from "@/lib/navigate"
import { ProjectProp } from "../types"
import { Form } from "@/lib/formv2/form-component"
import { addProjectDomainForm } from "./project-domain-add-form"
import { route } from "../routes"

export async function ProjectDomainAddModalDialog({ project, children }:
  & ProjectProp
  & Props.Children
) {
  return (
    <Modal
      name="add_url"
      button={Button => children}
      content={dialog => <>
        {children}
        <ModalContent>
          <DialogSurface wide>
            <DialogTitle>Add Project URL</DialogTitle>
            <Form
              form={addProjectDomainForm(project)}
              onSubmit={async () => {
                "use server"
                navigate.push(route.projectPage(project.id), { success: 'domain_added' }, dialog.context)
              }}
            />
          </DialogSurface>
        </ModalContent>
      </>}
    />
  )
}