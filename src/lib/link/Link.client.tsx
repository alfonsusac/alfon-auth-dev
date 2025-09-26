"use client"

import NextLink from "next/link"
import type { ComponentProps } from "react"



export function LinkClient({
  shallow,
  replace,
  scroll,
  prefetch,
  client,
  ...props
}: ComponentProps<"a"> & {
  shallow?: boolean
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
  client?: boolean
}) {
  return <NextLink
    {...props}
    href={props.href ?? "#"}
    replace={replace}
    scroll={scroll}
    prefetch={prefetch}
    onClick={(e) => {
      if (props.onClick) props.onClick(e)
      if (e.defaultPrevented) return
      if (client) {
        e.preventDefault()
        const href = props.href?.toString() ?? "#"
        if (replace)
          window.history.pushState({}, "", href)
        else 
          window.history.replaceState({}, "", href)
      }
    }}
  />
}

