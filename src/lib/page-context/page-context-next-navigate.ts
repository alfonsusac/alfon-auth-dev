import { fromPageSearchParamsToString } from "../next/next-search-params"
import { nextBetterRedirect } from "../next/next-better-redirects"



export function navigateWithContext(path: string, mode: "push" | "replace" = "push", context?: { [key: string]: string }): never {

  const hasContext = context && Object.keys(context).length > 0
  let newpath
  if (path.includes('?'))
    newpath = path + (hasContext ? '&' + fromPageSearchParamsToString(context) : '')
  else
    newpath = path + (hasContext ? '?' + fromPageSearchParamsToString(context) : '')

  nextBetterRedirect(newpath, mode)
}