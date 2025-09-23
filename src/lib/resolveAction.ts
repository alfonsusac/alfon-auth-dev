import { randomBytes } from "crypto"
import { redirect, RedirectType } from "next/navigation"

export function navigate(path: string, mode: "push" | "replace" = "push"): never {
  if (mode === "push")
    redirect('/___resolve___' + path, RedirectType.push)
  else
    redirect('/___resolve___' + path, RedirectType.replace)
}

export function navigateWithSuccess(path: string, code: string) {
  navigate(`${ path }?success=${ code }+${ randomBytes(3).toString('hex') }`, "push")
}

export function resolveRedirectError(error: any) {
  if (
    error instanceof Error
    && error.message === "NEXT_REDIRECT"
  ) {
    const digest = (error as any).digest as string
    // NEXT_REDIRECT;replace;/project2/key/e9d859c8-3816-40d5-8729-421dd7d268fa?error=callbackURI_must_match_domain;307;
    const [_, mode, path, code] = digest.split(";")
    // console.log({ mode, path, code })
    const actualPath = path.startsWith('/___resolve___') ? path.slice(14) : path
    if (mode === "replace")
      return { path: actualPath, mode: "replace" as const }
    else
      return { path: actualPath, mode: "push" as const }
  } else {
    return null
  }
}

export function updateSuccess() {
  navigateWithSuccess(``, `updated`)
}