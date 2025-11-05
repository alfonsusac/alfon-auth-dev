import { adminOnlyAction } from "@/shared/auth/admin-only"
import { navigate } from "../navigation"
import { isError } from "./error"

export function actionResolveError<T>(res: T, ...extraParams: (Record<string, string> | undefined)[]) {
  if (typeof res === "string")
    navigate.replace('', { error: res }, ...extraParams)
  else return res as Exclude<T, string>
}

export const action = {
  success: (type: 'replace' | 'push', route: string, successMessage: string, ...extraParams: (Record<string, string> | undefined)[]) => {
    navigate[type](route, { success: successMessage }, ...extraParams)
  },
  error: (res: string, ...extraParams: (Record<string, string> | undefined)[]) =>
    navigate.replace('', { error: res }, ...extraParams),
}


export function createAction<I extends any[], O>(props: {
  execute: (...args: I) => Promise<O>,
  admin?: boolean
  onSuccess?: (result: O) => void,
}) {

  return async (...args: I) => {
    "use server"
    if (props.admin)
      await adminOnlyAction()

    const res = await props.execute(...args)
  }

}