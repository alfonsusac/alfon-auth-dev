import { adminOnlyAction } from "@/shared/auth/admin-only"
import { getUser, type User } from "@/shared/auth/auth"

export function action<I extends any[], O, A extends boolean, F>(opts: {
  adminOnly: A,
  fn: (
    context: {
      input: F,
      user: A extends true ? User : A extends false ? (User | null) : never
    }
  ) => Promise<O>,
}) {

  type UserParamType = A extends true ? User : A extends false ? (User | null) : never

  return async (formInput: F) => {
    "use server"
    if (opts.adminOnly) {
      const user = await adminOnlyAction()
      return await opts.fn({ input: formInput, user: user as unknown as UserParamType })
    }
    const user = await getUser()
    return await opts.fn({ input: formInput, user: user as unknown as UserParamType })
  }
}