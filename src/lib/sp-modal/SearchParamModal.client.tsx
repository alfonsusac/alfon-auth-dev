"use client"

import { cn } from "lazy-cn"
import { useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"

export function SearchParamModal(props: {
  name: string,
  children?: React.ReactNode,
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === ''

  return <ModalShell show={show}>
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
      show ? "modal-opened" : "pointer-events-none opacity-0",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center",
      props.className,
    )}
  />
}