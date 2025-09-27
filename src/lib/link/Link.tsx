import type { ComponentProps } from "react"
import { LinkClient } from "./Link.client"



export function Link(props: ComponentProps<typeof LinkClient> & {
  context?: { [key: string]: string }
}) {
  let newhref
  if (props.context) {
    if (props.href?.includes('#')) {
      let [nofragmenthref, fragment] = props.href.split('#', 2)
      if (nofragmenthref.includes('?')) {
        newhref = nofragmenthref + '&' + new URLSearchParams(props.context).toString() + '#' + fragment
      } else {
        newhref = nofragmenthref + '?' + new URLSearchParams(props.context).toString() + '#' + fragment
      }
    }
    if (props.href?.includes('?')) {
      newhref = props.href + '&' + new URLSearchParams(props.context).toString()
    } else {
      newhref = props.href + '?' + new URLSearchParams(props.context).toString()
    }
  } else {
    newhref = props.href
  }
  return <LinkClient {...props} href={newhref} data-url={JSON.stringify(props.context)} />
}
