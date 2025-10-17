import type { ComponentProps } from "react"
import { FormWithClientRedirect } from "./form-redirect-client"
import { resolveCustomRedirectError } from "../navigate"
import { redirect, RedirectType } from "next/navigation"

export function FormWithProgressiveRedirect(props: Omit<ComponentProps<"form">, "action"> & {
  action: (form: FormData) => Promise<void>
}) {
  const { action, ...rest } = props
  return <FormWithClientRedirect {...rest}
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
        return console.error('unhandled action error: ', error)
      }
    }}
    clientAction={props.action}
  />
}