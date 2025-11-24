import { form } from "@/module/action/form-action"
import { createProjectAction, updateProjectAction } from "./actions"
import { fieldMap } from "@/lib/formv2/input-fields/input-fields"
import { bindAction } from "@/lib/core/action"

const projectFields = fieldMap({
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
})

export const createProjectForm = form({
  action: bindAction(createProjectAction),
  fields: projectFields
})

export const updateProjectForm = (project_id: string) => form({
  action: bindAction(updateProjectAction, project_id),
  fields: projectFields
})
