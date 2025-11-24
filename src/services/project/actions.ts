"use server"

import { createProject, deleteProject, updateProject } from "./db"
import { projectInput } from "./validations"
import { action } from "@/module/action/action"

export const deleteProjectAction = action({
  adminOnly: true,
  fn: () => deleteProject,
  errors: {
    not_found: "project not found.",
  }
})

export const updateProjectAction = action({
  adminOnly: true,
  fn: () => updateProject,
  errors: {
    id_exists: "project id already exists.",
    not_found: "project not found.",
    ...projectInput.errors,
  }
})

export const createProjectAction = action({
  adminOnly: true,
  fn: context => createProject.bind(null, context.user?.id!),
  errors: {
    id_exists: "project id already exists.",
    ...projectInput.errors,
  }
})


