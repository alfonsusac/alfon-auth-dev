import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { redirect, RedirectType, type useRouter } from "next/navigation"


const SLASH_RESOLVE_PATH_PREFIX = '/___resolve___?url='


export function nextBetterRedirect(path: string, mode: "push" | "replace" = "push"): never {

  if (mode === "push")
    redirect(SLASH_RESOLVE_PATH_PREFIX + path, RedirectType.push)
  else
    redirect(SLASH_RESOLVE_PATH_PREFIX + path, RedirectType.replace)

}



export function resolveNextBetterRedirectError(error: any) {

  if (error instanceof Error === false
    || error.message !== "NEXT_REDIRECT"
    || 'digest' in error === false
    || typeof error.digest !== 'string'
  ) return null

  const digest = error.digest
  const [_, mode, path, __] = digest.split(";")
  const actualPath = path.startsWith(SLASH_RESOLVE_PATH_PREFIX)
    ? path.split(SLASH_RESOLVE_PATH_PREFIX)[1]
    : path

  return {
    path: actualPath,
    mode: mode === "replace"
      ? "replace" as const
      : "push" as const
  }

}



export function throwRedirectIfNextBetterRedirectErrorAtServer(error: any): null |  never {

  const redirection = resolveNextBetterRedirectError(error)
  if (!redirection) return null

  redirect(redirection.path, redirection.mode === "replace"
    ? RedirectType.replace
    : RedirectType.push
  )

}



export function redirectIfNextBetterRedirectErrorAtClient(error: any, router: AppRouterInstance) {
  const redirection = resolveNextBetterRedirectError(error)
  if (!redirection) return null

  if (redirection.mode === "replace")
    return () => router.replace(redirection.path, { scroll: false })
  else
    return () => router.push(redirection.path)
}