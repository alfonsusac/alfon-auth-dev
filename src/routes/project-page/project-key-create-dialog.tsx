import { actionAdminOnly } from "@/lib/auth"
import { form } from "@/lib/basic-form/app-form"
import { DialogTitle } from "@/lib/dialogs/dialog"
import { DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { Props, searchParams } from "@/lib/page"
import { actionResolveError } from "@/lib/redirects"
import { actionNavigate, navigate } from "@/lib/resolveAction"
import { ErrorCallout } from "@/lib/toast/search-param-toast.client"
import { createProjectKey } from "@/services/projects"
import { revalidatePath } from "next/cache"
import { ProjectProp } from "../types"
import { Form } from "@/lib/formv2/form-component"
import { createProjectKeyForm } from "./project-key-create-form"
import { route } from "../routes"

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
            onSubmit={async () => {
              "use server"
              navigate.push(route.projectPage(project.id), { success: 'key_added' })
            }}
            searchParams={sp}
          />
        </DialogSurface>
      </>}
    />
  )
}