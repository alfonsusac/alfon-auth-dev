import type { ComponentProps } from "react"
import { FormWithClientRedirect } from "./form-redirect-client"
import { throwRedirectIfNextBetterRedirectErrorAtServer } from "../next/next-better-redirects"

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

        throwRedirectIfNextBetterRedirectErrorAtServer(error)
        return console.error('unhandled action error: ', error)

      }
    }}
    clientAction={props.action}
  />
}