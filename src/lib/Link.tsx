import type { ComponentProps } from "react"
import NextLink, { type LinkProps } from "next/link"





export function Link(props: ComponentProps<"a"> & {
  href?: string
}) {

  // Using Next.js's Link
  return <NextLink
    {...props}
    href={props.href ?? "#"}
  />
}
