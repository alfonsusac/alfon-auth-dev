import { actionAdminOnly } from "@/lib/auth"
import { createForm } from "@/lib/formv2/form"
import { createProjectKey, type Project } from "@/services/projects"

export function createProjectKeyForm(project: Project) {
  return createForm({
    fields: {
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
    },
    action: async inputs => {
      "use server"
      await actionAdminOnly(`/${ project.id }`)
      const res = await createProjectKey(inputs)
    },
  })({
    errorMessages: {
      missing_fields: "missing required fields.",
      project_not_found: "project not found.",
    }
  })
}