import { actionAdminOnly } from "@/lib/auth"
import { createForm } from "@/lib/formv2/form"
import { updateProject, type Project } from "@/services/projects"
import { route } from "../routes"

export function editProjectForm(project: Project) {
  return createForm({
    fields: {
      name: {
        type: "text", required: true, autoFocus: true,
        label: "project name",
        helper: "give your project a name for identification",
      },
      id: {
        type: "text", required: true,
        label: "project id",
        helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
        prefix: "https://auth.alfon.dev/",
      },
      description: {
        type: "text",
        label: "description",
        helper: "describe your project for future reference (optional)",
      },
    },
    action: async inputs => {
      "use server"
      await actionAdminOnly(route.projectPage(project.id))
      return await updateProject(inputs, project.id)
    }
  })({
    errorMessages: {
      invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
      missing_fields: "please fill out all required fields.",
      not_found: "project not found.",
      id_exists: "project id already exists.",
    }
  })
}