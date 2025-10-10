import { actionAdminOnly } from "@/lib/auth"
import { createForm } from "@/lib/formv2/form"
import { updateProjectKey, type Project, type ProjectKey } from "@/services/projects"

export function editProjectKeyForm(project: Project, key: ProjectKey) {
  return createForm({
    fields: {
      name: {
        label: "key name",
        type: "text",
        defaultValue: key.name,
        helper: "describe your project key to differentiate with other keys",
        required: true,
      },
      project_id: {
        type: 'readonly',
        value: project.id,
      }
    },
    action: async inputs => {
      "use server"
      await actionAdminOnly(`/${ project.id }`)
      const res = await updateProjectKey(inputs, key.id)
    }
  })({
    errorMessages: {
      missing_fields: "please fill out all required fields.",
      not_found: "project key not found.",
      project_not_found: "project not found.",
    }
  })
}