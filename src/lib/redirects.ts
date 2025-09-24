import { redirect, RedirectType } from "next/navigation"
import { actionNavigate } from "./resolveAction"

export function resolveError<T>(path: string, res: T, inputs?: object) {
  if (typeof res === "string")
    actionNavigate(`?error=${ res }${ inputs ? '&' + new URLSearchParams(inputs as Record<string, string>).toString() : '' }`, RedirectType.replace)
  else return res as Exclude<T, string>
}
