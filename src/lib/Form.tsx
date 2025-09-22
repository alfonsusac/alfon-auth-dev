"use client"

import { useRouter } from "next/navigation"
import { resolveRedirectError } from "./resolveAction"
import { FormButton } from "./FormButton"
import { SPCallout } from "./SearchParamsCallout"
import type { ComponentProps } from "react"
import { cn } from "lazy-cn"
import type { FormFieldMap } from "./FormBasic"

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

export namespace FormWithInput {
  export type ActionFunction<F extends FormFieldMap> = (inputs: { [K in keyof F]: string }) => Promise<void>
}

export function FormWithInput<F extends FormFieldMap>({
  action,
  fields,
  ...props
}: Omit<React.ComponentProps<"form">, "action">
  & {
    action: FormWithInput.ActionFunction<F>
    fields: F
  }
) {
  return <Form {...props} action={formActionHandler(fields, action)} />
}

export function formActionHandler<T extends { [name: string]: any }>(fields: T, action: (inputs: { [K in keyof T]: string }) => Promise<void>) {
  return (form: FormData) => {
    const inputs: { [K in keyof T]: string } = {} as any
    for (const key in fields) {
      const value = form.get(key)
      if (typeof value === 'string') {
        inputs[key] = value
      } else {
        throw new Error(`Invalid value for field ${ key }`)
      }
    }
    return action(inputs)
  }
}