"use client"

import { useRouter } from "next/navigation"
import { startTransition, type ComponentProps } from "react"
import { redirectIfNextBetterRedirectErrorAtClient, resolveNextBetterRedirectError } from "../next/next-better-redirects"



export function FormWithClientRedirect(props:
  & ComponentProps<"form">
  & { clientAction?: (form: FormData) => Promise<void> }
) {
  const router = useRouter()

  const {
    clientAction,               // to be passed to action={}, cannot be modified.
    action: progressiveAction,  // to be passed to onSubmit={}, converted and wrapped with custom redirect handler.
    ...rest
  } = props

  return <form {...rest}
    action={progressiveAction}
    onSubmit={async e => {
      e.preventDefault()
      startTransition(async () => {
        try {

          if (!clientAction) return
          const formData = new FormData(e.target as HTMLFormElement)
          await clientAction(formData)

        } catch (error) {

          const redirection = redirectIfNextBetterRedirectErrorAtClient(error, router)
          if (redirection) return redirection()

          return console.error('unhandled client-side error:', error)

        }
      })
    }}
  />
}
