import { createProject, updateProject } from "@/services/projects"
import { actionAdminOnly } from "../auth"
import type { Action } from "./form-action"
import type { ErrorMessages } from "./form-action-results"
import type { ExtractErrorMessageMapFromRes } from "../toast/search-param-toast.client"
import type { FieldMap } from "./input-fields/input-fields"


// Form definition type

export type FormType<
  F extends FieldMap = any,
  R = any,
> = {
  fields: F,
  action: Action<F, R>,
  errorMessages: ErrorMessages<R>,
  $result: R,
}




// Factory function to create a form definition

export const createForm = <
  I extends FieldMap,
  R,
>(opts: { // Logic layer
  fields: I,
  action: Action<I, R>,
}) => (
  opts2: { // Still logic, just slightly improve DX for errorMessage auto completion.
    errorMessages?: ExtractErrorMessageMapFromRes<Action<I, R>>
  }
) => {
    return {
      fields: opts.fields,
      action: opts.action,
      errorMessages: opts2.errorMessages ?? {},
      $result: undefined as unknown as R,
    }
  }





export const editProjectForm = createForm({
  action: async input => {
    "use server"
    const user = await actionAdminOnly()
    return await updateProject(input, user.id)
  },
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
  }
})({
  errorMessages: {
    invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
    missing_fields: "please fill out all required fields.",
    not_found: "project not found.",
    id_exists: "project id already exists.",
  }
})