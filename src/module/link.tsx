import { LinkClientWithShallow } from "@/lib/next/next-link-with-shallow"
import { resolveHrefFromPageContext } from "@/lib/page-context/page-context"
import type { ComponentProps } from "react"

export function Link({ context, _blank, ...props }:
  & ComponentProps<typeof LinkClientWithShallow>
  & { context?: PageContext }
  & { _blank?: boolean }
) {
  const href = resolveHrefFromPageContext(props.href, context)
  return <LinkClientWithShallow {...props} href={href} target={
    _blank ? '_blank' : props.target
  } />
}