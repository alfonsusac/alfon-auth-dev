"use server"

import { action } from "@/module/action/action"
import { createProjectKey, deleteProjectKey, updateProjectKey } from "../project/db"
import { projectKeyInput } from "./validations"

export const createProjectKeyAction = action({
  adminOnly: true,
  fn: () => createProjectKey,
  errors: projectKeyInput.errors
})

export const editProjectKeyAction = action({
  adminOnly: true,
  fn: () => updateProjectKey,
  errors: {
    not_found: "project key not found.",
    ...projectKeyInput.errors,
  }
})

export const deleteProjectKeyAction = action({
  adminOnly: true,
  fn: () => deleteProjectKey,
  errors: {
    not_found: "project key not found.",
  }
})