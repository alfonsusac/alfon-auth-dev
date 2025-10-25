import { navigate } from "../navigation"

export function actionResolveError<T>(res: T, ...extraParams: (Record<string, string> | undefined)[]) {
  if (typeof res === "string")
    navigate.replace('', { error: res }, ...extraParams)
  else return res as Exclude<T, string>
}