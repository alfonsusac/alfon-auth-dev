import type { ComponentProps } from "react"
import { throwRedirectIfNextBetterRedirectErrorAtServer } from "../next/next-better-redirects"
import { FormClient, type FormClientActionWithContext } from "./form-client"

export function FormWithProgressiveRedirect(props:
  & Omit<ComponentProps<"form">, "action">
  & { action: FormClientActionWithContext }
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

export type FormActionFirstlyBinded = (
  formClientContext: { context: PageContext | undefined },
  form: FormData
) => Promise<void>
