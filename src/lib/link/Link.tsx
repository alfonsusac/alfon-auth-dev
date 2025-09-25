import type { ComponentProps } from "react"
import { LinkClient } from "./Link.client"



export function Link(props: ComponentProps<typeof LinkClient>) {
  return <LinkClient {...props} />
}
