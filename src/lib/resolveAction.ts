import { redirect, RedirectType } from "next/navigation"

export function navigate(path: string, mode: "push" | "replace" = "push"): never {
  console.log(path)
  if (mode === "push")
    redirect('/___resolve___?url=' + path, RedirectType.push)
  else
    redirect('/___resolve___?url=' + path, RedirectType.replace)
}


export function resolveCustomRedirectError(
  error: any
) {
  if (
    error instanceof Error
    && error.message === "NEXT_REDIRECT"
  ) {
    const digest = (error as any).digest as string
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