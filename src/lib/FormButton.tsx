"use client"

import type { ComponentProps, ReactNode } from "react"
import { useFormStatus } from "react-dom"

export function FormButton(props: ComponentProps<"button">
  & { loading: ReactNode }
) {
  const { pending } = useFormStatus()

  return (
    <button {...props}
      type="submit"
      children={pending ? props.loading : props.children}
      disabled={pending || props.disabled}
    />
  )
}