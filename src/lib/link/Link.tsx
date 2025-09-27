import type { ComponentProps } from "react"
import { LinkClient } from "./Link.client"



export function Link(props: ComponentProps<typeof LinkClient> & {
  context?: { [key: string]: string }
}) {
  let newhref
  if (props.context) {
    if (props.href?.includes('#')) {
      const [nofragmenthref, fragment] = props.href.split('#', 2)
      newhref = resolveFragmentlessHrefWithMergedSearchParams(nofragmenthref, props.context) + '#' + fragment
    }
    else newhref = resolveFragmentlessHrefWithMergedSearchParams(props.href, props.context)
  } else newhref = props.href

  return <LinkClient {...props} href={newhref} data-url={JSON.stringify(props.context)} />
}



function resolveFragmentlessHrefWithMergedSearchParams(nofragmenthref: string | undefined, context: { [key: string]: string }) {
  if (nofragmenthref?.includes('?')) {
    const [path, sp] = nofragmenthref.split('?', 2)
    return path + '?' + new URLSearchParams(context).toString() + '&' + sp
  }
  return nofragmenthref + '?' + new URLSearchParams(context).toString()
}
