import { createProject } from "./db"

function action<I extends any[], O>(opts: {
  fn: (...args: I) => Promise<O>
}) {
  return async (form: FormData) => {
    "use server"
    await opts.fn(...{} as any)
  }
}

export const createProjectAction = action({
  fn: createProject
})