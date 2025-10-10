import type { ComponentProps } from "react"
import { LinkClient } from "./link.client"



export function Link({ context, ...props }: ComponentProps<typeof LinkClient> & {
  context?: PageContext
}) {
  let newhref
  if (context) {
    if (props.href?.includes('#')) {
      const [nofragmenthref, fragment] = props.href.split('#', 2)
      newhref = resolveFragmentlessHrefWithMergedSearchParams(nofragmenthref, context) + '#' + fragment
    }
    else newhref = resolveFragmentlessHrefWithMergedSearchParams(props.href, context)
  } else newhref = props.href

  return <LinkClient {...props} href={newhref} />
}



function resolveFragmentlessHrefWithMergedSearchParams(nofragmenthref: string | undefined, context: PageContext) {
  if (nofragmenthref?.includes('?')) {
    const [path, sp] = nofragmenthref.split('?', 2)
    return path + '?' + new URLSearchParams(context).toString() + '&' + sp
  }
  return nofragmenthref + '?' + new URLSearchParams(context).toString()
}

declare global {
  type PageContext = { [key: string]: string }
  type PageContextProp = { context?: PageContext }
  type PageSearchParams = Awaited<PageProps<'/'>['searchParams']>
}

export function normalizePageSearchParams(searchParams: PageSearchParams): PageContext {
  const context: PageContext = {}
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string') context[k] = v
    else if (Array.isArray(v)) context[k] = v.join(',')
    else if (v === undefined) context[k] = ''
    else context[k] = String(v)
  }
  return context
}