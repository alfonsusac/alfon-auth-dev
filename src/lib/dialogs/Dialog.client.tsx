"use client"

import { useEffect } from "react"
import { Link } from "../link/Link"
import { useSearchParams } from "next/navigation"
import { cn } from "lazy-cn"


export function DialogButtonBase(props: {
  name: string,
  button: React.ReactNode,
  children?: React.ReactNode,
  context?: { [key: string]: string }
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === 'show'

  return <>
    <Link
      href={`?${ props.name }=show`}
      scroll={false}
      client
      className="w-fit"
      context={props.context}
    >
      {props.button}
    </Link>

    <div className={cn(
      show ? "" : "pointer-events-none",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center",
    )}
      data-show={show ? "" : undefined}
    > 
      {show && <div className="modal-opened" />}
      {props.children}
    </div>
  </>
}


export function DialogButtonBase2(props: {
  name: string,
  label: React.ReactNode,
  className?: string,
  children?: React.ReactNode,
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === 'show'

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [show])

  return <>
    <Link
      className={cn("button small", props.className)}
      href={`?${ props.name }=show`}
      scroll={false}
      client
    >
      {props.label}
    </Link>

    <div className={cn(
      // "transition-opacity duration-50",
      // show ? "opacity-100" : "opacity-0 pointer-events-none duration-150",
      show ? "" : "pointer-events-none",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center",
    )}
      data-show={show ? "" : undefined}
    >
      {props.children}
    </div>
  </>
}