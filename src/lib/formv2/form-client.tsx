"use client"

import { type ComponentProps } from "react"
import { FormWithProgressiveRedirect } from "./form-redirect"
import { useModalContentContext } from "../dialogsv2/modal.client"
import type { FormActionFirstlyBinded } from "@/module/form-action"
import { FormWithClientRedirect } from "./form-redirect-client"

// Combines all client-side feature together
// - progressive redirection
// - search params context from modal/dialogs

export function FormClient(props:
  & Omit<ComponentProps<"form">, "action">
  & { action: FormActionFirstlyBinded }
  & { clientAction?: FormActionFirstlyBinded }
) {
  const context = useModalContentContext()
  return <FormWithClientRedirect
    {...props}
    action={props.action.bind(null, { context: context.context })}
    clientAction={props.clientAction?.bind(null, { context: context.context })}
  />
}