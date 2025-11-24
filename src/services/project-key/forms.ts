import { fieldMap } from "@/lib/formv2/input-fields/input-fields"
import { createProjectKeyAction, editProjectKeyAction } from "./actions"
import { form } from "@/module/action/form-action"

const projectKeyFields = fieldMap({
  name: {
    type: "text",
    label: "Key Name",
    helper: "describe your project key to differentiate with other keys",
    placeholder: "My Secret Key",
    required: true,
  },
})

export const createProjectKeyForm = form({
  action: createProjectKeyAction,
  fields: projectKeyFields
})

export const editProjectKeyForm = form({
  action: editProjectKeyAction,
  fields: projectKeyFields
})