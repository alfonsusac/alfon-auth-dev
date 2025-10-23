import { refresh } from "next/cache"
import { fromPageSearchParamsToString } from "./searchParams"
import { nextBetterRedirect, resolveNextBetterRedirectError } from "./next/next-better-redirects"


export const navigate = {
  push: (path: string, ...contexts: (PageContext | undefined)[]): never => appNavigate(path, "push", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  replace: (path: string, ...contexts: (PageContext | undefined)[]): never => appNavigate(path, "replace", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  refresh: (): never => { refresh(), navigate.replace('') }
}


function appNavigate(path: string, mode: "push" | "replace" = "push", context?: { [key: string]: string }): never {

  const hasContext = context && Object.keys(context).length > 0
  let newpath
  if (path.includes('?'))
    newpath = path + (hasContext ? '&' + fromPageSearchParamsToString(context) : '')
  else
    newpath = path + (hasContext ? '?' + fromPageSearchParamsToString(context) : '')

  nextBetterRedirect(newpath, mode)
}




// export function resolveCustomRedirectError(error: any) {
//   return resolveNextBetterRedirectError(error)
// }