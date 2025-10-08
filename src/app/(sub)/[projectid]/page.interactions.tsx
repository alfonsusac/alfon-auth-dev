import { actionAdminOnly } from "@/lib/auth"
import { form } from "@/lib/basic-form/app-form"
import { DialogCloseButton, DialogTitle } from "@/lib/dialogs/dialog"
import { DeleteDialogButton } from "@/lib/dialogs/dialog-delete"
import { DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { ModalContent } from "@/lib/dialogsv2/modal.client"
import type { Props } from "@/lib/page"
import { actionResolveError } from "@/lib/redirects"
import { actionNavigate } from "@/lib/resolveAction"
import { ErrorCallout } from "@/lib/toast/search-param-toast.client"
import { createDomain, createProjectKey, deleteProject } from "@/services/projects"
import { EditProjectForm } from "@/services/projects.form"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import type { ProjectProp } from "./page"


export async function ProjectSettingsModal({ project, searchParams, children }:
  & ProjectProp
  & Props.SearchParams
  & Props.Children
) {
  return (
    <Modal name={`project_setting_${ project.id }`}>
      {modal => <>
        {children}
        <ModalContent>
          <DialogSurface wider>
            <DialogCloseButton />
            <h2 className="page-h2">Project Settings</h2>
            <section className="category">
              <h3 className="category-header">project details ↓</h3>
              <EditProjectForm
                projectid={project.id}
                onSuccess={async (error, inputs) => {
                  "use server"
                  actionResolveError(error, inputs, modal.context)
                  revalidatePath(`/`, 'layout')
                  actionNavigate(`/${ inputs.id }?success=updated+${ nanoid(3) }`, "replace", modal.context)
                }}
                defaultValues={{
                  name: project.name,
                  id: project.id,
                  description: project.description ?? "",
                  ...searchParams,
                }}
              />
            </section>

            <section className="category">
              <h3 className="category-header">danger zone ↓</h3>
              <DeleteDialogButton
                context={modal.context}
                name={`project-${ project.id }`}
                what="Project"
                alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
                action={async () => {
                  "use server"
                  await actionAdminOnly()
                  const res = await deleteProject(project.id)
                  actionResolveError(res, { delete: '' })
                  revalidatePath('/', 'layout')
                  actionNavigate('/?success=deleted')
                }}
              />
            </section>

          </DialogSurface>
        </ModalContent>
      </>}
    </Modal>
  )
}

export async function  ProjectDomainAddModalDialog({ project, searchParams, children }:
  & ProjectProp
  & Props.SearchParams
  & Props.Children
) {
  return (
    <Modal name="add_url">
      {dialog => <>
        {children}
        <ModalContent >
          <DialogSurface wide>
            <DialogTitle>Add Project URL</DialogTitle>
            <form.CreateForm
              name="Add Project Domain"
              action={async inputs => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await createDomain({
                  project_id: inputs.project_id,
                  origin: inputs.origin,
                  redirect_url: inputs.origin + inputs.redirect_url,
                })
                actionResolveError(res, { ...inputs, ...dialog.context })
                revalidatePath(`/${ project.id }`)
                actionNavigate(`/${ project.id }?success=domain_added`)
              }}
              fields={{
                project_id: {
                  type: 'readonly',
                  value: project.id
                },
                origin: {
                  label: "domain",
                  helper: "the domain where your application is hosted. (no trailing slash)",
                  placeholder: "https://example.com",
                  type: "text",
                  required: true
                },
                redirect_url: {
                  label: "redirect path",
                  prefix: 'https://your.domain.com',
                  placeholder: "/api/auth/callback",
                  type: "text",
                  required: true,
                  helper: "must be on the same domain as callback url"
                }
              }}
              searchParams={searchParams}
              errorCallout={<ErrorCallout<typeof createDomain> messages={{
                project_not_found: "project not found.",
                missing_fields: "missing required fields.",
                invalid_origin: "invalid callback url format.",
                invalid_redirect_url: "invalid redirect url format.",
                mismatched_domains: "redirect url must be on the same domain as callback url.",
                insecure_origin: "origin must use https unless using localhost.",
                insecure_redirect_url: "redirect url must use https unless using localhost.",
                domain_exists: "domain already exists for this project.",
                domain_in_use: `domain is already in use by another project: $1`,
              }} />}
            />
          </DialogSurface>
        </ModalContent>
      </>}
    </Modal>
  )
}

export async function ProjectKeyCreateModalDialog({ project, searchParams, children }:
  & ProjectProp
  & Props.SearchParams
  & Props.Children
) {
  return (
    <Modal name={"create_key"}>
      {dialog => <>
        {children}
        <ModalContent>
          <DialogSurface wide>
            <DialogTitle>Create Secret Key</DialogTitle>
            <p className="mb-4 -mt-3">
              Project keys are used to authorize your application to use the authentication services.
            </p>
            <form.CreateForm
              name="Create Project Key"
              action={async inputs => {
                "use server"
                await actionAdminOnly(`/${ project.id }`)
                const res = await createProjectKey(inputs)
                actionResolveError(res, { ...inputs, ...dialog.context })
                revalidatePath(`/${ project.id }`)
                actionNavigate(`/${ project.id }?success=key_added`)
              }}
              fields={{
                name: {
                  type: "text",
                  label: "Key Name",
                  placeholder: "My Secret Key",
                  required: true,
                },
                project_id: {
                  type: 'readonly',
                  value: project.id,
                },
              }}
              searchParams={searchParams}
              errorCallout={<ErrorCallout<typeof createProjectKey> messages={{
                missing_fields: "missing required fields.",
                project_not_found: "project not found.",
              }} />}
            />
          </DialogSurface>
        </ModalContent>
      </>}
    </Modal>
  )
}