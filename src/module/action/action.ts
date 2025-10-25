import { navigate } from "../navigation"

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