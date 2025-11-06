import type { ComponentProps } from "react"
import { FormWithClientRedirect } from "./form-redirect-client"
import { throwRedirectIfNextBetterRedirectErrorAtServer } from "../next/next-better-redirects"
import { FormClient } from "./form-client"
import type { FormActionFirstlyBinded } from "@/module/form-action"

export function FormWithProgressiveRedirect(props:
  & Omit<ComponentProps<"form">, "action">
  & { action: FormActionFirstlyBinded }
) {
  const { action, ...rest } = props
  return <FormClient {...rest}
    action={async (context, form) => {
      "use server"
      try {

        await props.action(context, form)

      } catch (error) {

        throwRedirectIfNextBetterRedirectErrorAtServer(error)
        return console.error('unhandled action error: ', error)

      }
    }}
    clientAction={props.action}
  />
}