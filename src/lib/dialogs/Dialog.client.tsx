"use client"

import { useEffect } from "react"
import { Link } from "../link/Link"

export function DialogBackdropLink(props: {

}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return <Link
    className="absolute top-0 left-0 w-full h-full bg-foreground/25 animate-dialog-in"
    href={"?"}
    replace
    scroll={false}
  />
}