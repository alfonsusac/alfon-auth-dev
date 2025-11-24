import { validation } from "@/lib/core/validation"

export const projectInput = validation({
  validate: async (input: {
    id: string,
    name: string,
    description: string
  }) => {
    if (!input.name || !input.id) return "missing_fields"
    if (!/^[a-zA-Z0-9-_]+$/.test(input.id)) return "invalid_id"
    return input
  },
  errors: {
    invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
    missing_fields: "please fill out all required fields.",
  },
})

export type ProjectInput = typeof projectInput.$type