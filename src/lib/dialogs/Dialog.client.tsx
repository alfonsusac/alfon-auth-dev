"use client"

import { useEffect } from "react"
import { Link } from "../link/Link"
import { useSearchParams } from "next/navigation"
import { cn } from "lazy-cn"

export function DialogBackdropLink(props: {
  show?: boolean
}) {
  useEffect(() => {
    if (!props.show) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [props.show])

  return <Link
    className="absolute top-0 left-0 w-full h-full bg-foreground/25 animate-dialog-in"
    href={"?"}
    scroll={false}
    client
  />
}

export function DialogBase(props: {
  name: string,
  label: React.ReactNode,
  children?: React.ReactNode,
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === 'show'

  return <>
    <Link
      className="button destructive small"
      href={`?${ props.name }=show`}
      scroll={false}
      client
    >
      {props.label}
    </Link>

    <div className={cn(
      "transition-opacity duration-50",
      show ? "opacity-100" : "opacity-0 pointer-events-none duration-100",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)"
    )}>
      <DialogBackdropLink />
      {props.children}
    </div>
  </>
}