"use client"

import { useRouter } from "next/navigation"
import { FormUtil } from "./form.helper"
import type { ComponentProps } from "react"

export function UnifiedFormWithClientRedirect(props: ComponentProps<"form"> & {
  clientAction?: (form: FormData) => Promise<void>
}) {
  const router = useRouter()

  const {
    clientAction,               // to be passed to action={}, cannot be modified.
    action: progressiveAction,  // to be passed to onSubmit={}, converted and wrapped with custom redirect handler.
    ...rest
  } = props

  return <form
    {...rest}
    action={progressiveAction}
    onSubmit={async e => {
      try {
        await props.onSubmit?.(e)
        if (e.defaultPrevented) return
        if (!clientAction) return
        console.log(e)
        const formData = new FormData(e.target as HTMLFormElement)
        await clientAction(formData)
      } catch (error) {
        const redirection = FormUtil.resolveCustomRedirectError(error)
        if (redirection) {
          if (redirection.mode === "replace")
            return router.replace(redirection.path, { scroll: false })
          if (redirection.mode === "push")
            return router.push(redirection.path)
        }
        return console.error(error)
      }
    }}
  />
}
