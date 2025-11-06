import { ListItem } from "@/lib/primitives"
import { DomainProp } from "@/routes/types"
import type { ComponentProps } from "react"

export function ProjectDomainListItem({ domain, ...rest }:
  & ComponentProps<'li'>
  & DomainProp
) {
  const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
  const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')

  return <>
    <ListItem className="text-foreground-body/75 leading-3 text-[0.813rem]" {...rest}>
      <span className="text-foreground-body/50">{protocol}</span>
      <span className="font-medium text-foreground">{origin}</span>
      <span>{domain.redirect_url.replace(domain.origin, '')}</span>
    </ListItem>
  </>
}