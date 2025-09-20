import { redirect, RedirectType } from "next/navigation"

export function displayError(path: string, msg: string): never {
  redirect(`${ path }?error=${ msg }`, RedirectType.replace)
}

export function resolveError(path: string, res: any) {
  if (typeof res === "string")
    redirect(`${ path }?error=${ res }`, RedirectType.replace)
}

export function unauthorizedAction(path: string) {
  redirect(`${ path }?error=unauthorized`, RedirectType.replace)
}