"use server"

import { action } from "@/module/action/action"
import { createDomain, deleteDomain, updateDomain } from "../project/db"
import { projectDomainInputValidation } from "./validations"

export const addProjectDomainAction = action({
  adminOnly: true,
  fn: () => createDomain,
  errors: projectDomainInputValidation.errors
})

export const updateProjectDomainAction = action({
  adminOnly: true,
  fn: () => updateDomain,
  errors: projectDomainInputValidation.errors
})

export const deleteProjectDomainAction = action({
  adminOnly: true,
  fn: () => deleteDomain,
  errors: {
    not_found: "The specified domain does not exist."
  }
})