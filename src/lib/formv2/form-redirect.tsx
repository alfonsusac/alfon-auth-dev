import type { ComponentProps } from "react"
import { FormWithClientRedirect } from "./form-redirect-client"
import { resolveCustomRedirectError } from "../resolveAction"
import { redirect, RedirectType } from "next/navigation"

export function FormWithProgressiveRedirect(props: Omit<ComponentProps<"form">, "action"> & {
  action: (form: FormData) => Promise<void>
}) {
  return <FormWithClientRedirect {...props}
    action={async form => {
      "use server"
      try {
        await props.action(form)
      } catch (error) {
        const redirection = resolveCustomRedirectError(error)
        if (redirection) {
          if (redirection.mode === "replace")
            redirect(redirection.path, RedirectType.push)
          if (redirection.mode === "push")
            redirect(redirection.path, RedirectType.replace)
        }
        return console.error(error)
      }
    }}
    clientAction={props.action}
  />
}