import { createForm } from "@/lib/formv2/form"
import { createProjectKey, type Project } from "@/services/projects"
import { adminOnlyAction } from "@/shared/auth/admin-only"

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
      await adminOnlyAction()
      const res = await createProjectKey(inputs)
    },
  })({
    errorMessages: {
      missing_fields: "missing required fields.",
      project_not_found: "project not found.",
    }
  })
}