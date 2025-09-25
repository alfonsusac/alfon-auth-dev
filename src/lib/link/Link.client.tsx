"use client"

import NextLink from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
        console.log("shallow navigation to", href)
        if (replace)
          window.history.pushState({}, "", href)
        else 
          window.history.replaceState({}, "", href)

        // if (replace)
          // router.replace(href, { scroll })
        // else
          // router.push(href, { scroll })
        // const url = new URL(href, location.origin)
        // url.searchParams.forEach((value, key) => {
        //   if (sp.get(key) === value) url.searchParams.delete(key)
        // })
        // router.replace(url.toString())
      }
    }}
  />
}

