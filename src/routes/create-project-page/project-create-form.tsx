import { createForm } from "@/lib/formv2/form"
import { createProject } from "@/services/projects"
import { adminOnlyAction } from "@/shared/auth/admin-only"

export const createProjectForm =
  createForm({
    action: async input => {
      "use server"
      const user = await adminOnlyAction()
      return await createProject(input, user.user_id)
    },
    fields: {
      name: {
        type: "text", required: true, autoFocus: true,
        label: "project name",
        helper: "give your project a name for identification",
        placeholder: "My Project",
        defaultValue: "New Project",
      },
      id: {
        type: "text", required: true,
        label: "project id",
        helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
        prefix: "https://auth.alfon.dev/",
        placeholder: "project_id",
      },
      description: {
        type: "text",
        label: "description",
        helper: "describe your project for future reference (optional)",
        placeholder: "This is my project",
      },
    }
  })({
    errorMessages: {
      id_exists: "project id already exists.",
      invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
      missing_fields: "please fill out all required fields.",
    }
  })
