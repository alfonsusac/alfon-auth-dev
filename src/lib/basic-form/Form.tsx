import type { ComponentProps } from "react"
import { UnifiedFormWithClientRedirect } from "./Form.client"
import { FormUtil, TypedForm } from "./form.helper"
import { redirect, RedirectType } from "next/navigation"

// The Form.

export function Form<F extends TypedForm.FormFieldMap = {}>({ action, fields, ...props }: TypedForm.FormProps<F>) {
  return <FormWithProgressiveCustomRedirectAndClientAction
    {...props}
    action={async form => {
      "use server"
      await TypedForm.toTypedAction(fields, action)(form)
    }}
  />
}

// The subsidiaries.

function FormWithProgressiveCustomRedirectAndClientAction(props: Omit<ComponentProps<"form">, "action"> & {
  action: (form: FormData) => Promise<void>
}) {
  return <UnifiedFormWithClientRedirect
    {...props}
    action={async form => {
      "use server"
      try {
        await props.action(form)
      } catch (error) {
        const redirection = FormUtil.resolveCustomRedirectError(error)
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