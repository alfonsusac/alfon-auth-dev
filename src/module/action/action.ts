import { getActionContext } from "@/lib/next/next-actions"
import { navigate } from "../navigation"
import { isError } from "./error"
import { createAction, type ActionErrorMap, type ActionFn } from "@/lib/core/action"
import { getUser, type User } from "@/shared/auth/auth"
import { sessionExpired } from "@/routes/(auth-layout)/session-expired-page/interface"


export const resolveAction = {
  success: (type: 'replace' | 'push', route: string, successMessage: string, ...extraParams: (Record<string, string> | undefined)[]) => {
    navigate[type](route, { success: successMessage }, ...extraParams)
  },
  error: (res: string, ...extraParams: (Record<string, string> | undefined)[]) =>
    navigate.replace('', { error: res }, ...extraParams),
}


async function adminOnlyAction(context?: PageContext, unauthenticated_path: string = '.',) {
  const { from } = await getActionContext()
  const user = await getUser()
  if (!user) sessionExpired(from)
  if (!user?.isAdmin)
    return navigate.replace(unauthenticated_path, context, { unauthorized: '' })
  return user
}



export function action<
  I extends any[],
  O,
>(opts: {
  adminOnly: boolean,
  fn: (context: {
    user: User | null
  }) => ActionFn<I, O>,
  errors: ActionErrorMap<O>
}) {
  return createAction({
    fn: async (...input: I) => {
      if (opts.adminOnly)
        await adminOnlyAction()

      const user = await getUser()

      const response = opts.fn({ user })(...input)

      if (isError(response))
        throw new ActionError(response)

      return response
    },
    errors: opts.errors,
  }).serialize()
}







export class ActionError extends Error {
  constructor(
    public readonly error_code: string
  ) {
    super(`Action Error: ${ error_code }`)
  }
}
