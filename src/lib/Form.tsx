"use client"

import { useRouter } from "next/navigation"
import { resolveRedirectError } from "./resolveAction"

export function Form({
  action,
  ...props
}: Omit<React.ComponentProps<"form">, "action"> & {
  action: (form: FormData) => Promise<void>
}) {
  const router = useRouter()

  return (<form {...props} action={
    async (formData: FormData) => {
      router.push('..')
      try {
        await action(formData)
      } catch (error) {

        const redirection = resolveRedirectError(error)
        if (redirection) {
          if (redirection.mode === "replace")
            router.replace(redirection.path, { scroll: false })
          if (redirection.mode === "push")
            router.push(redirection.path)
        }
      }
    }
  } />)
}