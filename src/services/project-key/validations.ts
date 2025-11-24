import { validation } from "@/lib/core/validation"
import { getProject } from "../project/db"

export const projectKeyInput = validation({
  validate: async (input: {
    name: string,
    project_id: string
  }) => {
    if (!input.name || !input.project_id) return "missing_fields"
    if (!await getProject(input.project_id)) return "project_not_found"
    return input
  },
  errors: {
    missing_fields: "please fill out all required fields.",
    project_not_found: "project not found.",
  }
})

export type ProjectKeyInput = typeof projectKeyInput.$type