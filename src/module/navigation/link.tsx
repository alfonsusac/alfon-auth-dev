import { LinkClientWithShallow } from "@/lib/next/next-link-with-shallow"
import { resolveHrefFromPageContext } from "@/lib/page-context/page-context"
import type { ComponentProps } from "react"

export function Link({ context, ...props }:
  & ComponentProps<typeof LinkClientWithShallow>
  & { context?: PageContext }
) {
  const href = resolveHrefFromPageContext(props.href, context)
  return <LinkClientWithShallow {...props} href={href} />
}