"use client"

import { use, type ComponentProps } from "react"
import { modalContentContext } from "../dialogsv2/modal.client"
import { FormWithClientRedirect } from "./form-redirect-client"

// Combines all client-side feature together
// - progressive redirection
// - search params context from modal/dialogs
//
// cons:
// - actions must follow FormActionFirstlyBinded signature

export function FormClient(props:
  & Omit<ComponentProps<"form">, "action">
  & { action: FormClientActionWithContext }
  & { clientAction?: FormClientActionWithContext }
) {
  const context = use(modalContentContext.context)
  return <FormWithClientRedirect
    {...props}
    action={props.action.bind(null, { context: context?.context })}
    clientAction={props.clientAction?.bind(null, { context: context?.context })}
  />
}

export type FormClientActionWithContext = (
  formClientContext: { context: PageContext | undefined },
  form: FormData
) => Promise<void>