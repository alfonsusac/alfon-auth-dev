"use client"

import { cn } from "lazy-cn"
import { useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"

export function SearchParamModal(props: {
  name: string,
  children?: React.ReactNode,
  className?: string
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === ''

  return <ModalShell show={show} className={props.className}>
    {props.children}
  </ModalShell>
}






function ModalShell({ show, ...props }: ComponentProps<"div"> & {
  show: boolean
}) {
  return <div
    {...props}
    data-show={show ? "" : undefined}
    className={cn(
      // Animated
      "transition-all duration-50",
      show ? "" : "duration-100",


      // Base
      show ? "modal-opened pointer-events-auto" : "pointer-events-none opacity-0",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center",
      props.className,
    )}
  />
}