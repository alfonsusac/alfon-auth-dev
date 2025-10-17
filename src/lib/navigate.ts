import { refresh } from "next/cache"
import { notFound, redirect, RedirectType } from "next/navigation"
import { fromPageSearchParamsToString } from "./searchParams"

export function actionNavigate(path: string, mode: "push" | "replace" = "push", context?: { [key: string]: string }): never {

  const hasContext = context && Object.keys(context).length > 0
  let newpath
  if (path.includes('?')) {
    newpath = path + (hasContext ? '&' + fromPageSearchParamsToString(context) : '')
  } else {
    newpath = path + (hasContext ? '?' + fromPageSearchParamsToString(context) : '')
  }
  // console.log("Navigating to:", newpath, "with context:", context, "using mode:", mode, "original path:", path)

  if (mode === "push")
    redirect('/___resolve___?url=' + newpath, RedirectType.push)
  else
    redirect('/___resolve___?url=' + newpath, RedirectType.replace)
}

export const navigate = {
  push: (path: string, ...contexts: (PageContext | undefined)[]): never => actionNavigate(path, "push", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  replace: (path: string, ...contexts: (PageContext | undefined)[]): never => actionNavigate(path, "replace", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  refresh: (): never => { refresh(), navigate.replace('') }
}


export function resolveCustomRedirectError(
  error: any
) {
  if (
    error instanceof Error
    && error.message === "NEXT_REDIRECT"
  ) {
    const digest = (error as any).digest as string
    console.log(digest)
    // NEXT_REDIRECT;replace;/project2/key/e9d859c8-3816-40d5-8729-421dd7d268fa?error=callbackURI_must_match_domain;307;
    const [_, mode, path, __] = digest.split(";")
    const actualPath = path.startsWith('/___resolve___?url=') ? path.split('/___resolve___?url=')[1] : path
    console.log("Actual Path in resolver:", actualPath, path)
    if (mode === "replace")
      return { path: actualPath, mode: "replace" as const }
    else
      return { path: actualPath, mode: "push" as const }
  } else {
    return null
  }
}