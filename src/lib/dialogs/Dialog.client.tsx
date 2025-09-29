"use client"

import { type ComponentProps } from "react"
import { Link } from "../link/link"
import { cn } from "lazy-cn"

export function DialogRoot({ show, ...props }: ComponentProps<"div"> & {
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

export function DialogJustButtonBase(props: ComponentProps<typeof Link> & {
  href?: string,
  children: React.ReactNode,
  context?: PageContext
}) {
  const { context, ...rest } = props
  return <Link {...rest}
    href={props.href}
    scroll={false}
    client
    context={props.context}
  >
    {props.children}
  </Link>
}