"use client"

import NextLink from "next/link"
import type { ComponentProps } from "react"



export function LinkClient({
  shallow,
  replace,
  scroll,
  disableBackgroundScroll,
  ...props
}: ComponentProps<"a"> & {
  shallow?: boolean
  replace?: boolean
  scroll?: boolean
  disableBackgroundScroll?: boolean
}) {
  return <NextLink
    {...props}
    href={props.href ?? "#"}
    shallow={shallow}
    replace={replace}
    scroll={scroll}
  />
}