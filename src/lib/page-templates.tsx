// Base Page Template

import { cn } from "lazy-cn"
import { ReactNode } from "react"
import { NavigationBar } from "./NavigationBar"
import { Spacer } from "./spacer"
import { SuccessCallout } from "./next/next-search-param-toast.client"

export function DetailPage(props: {
  children?: ReactNode,
  toasts?: Record<string, ReactNode>,
  back?: [label: string, href: `/${ string }`]
  className?: string,
}) {
  return <>
    <SuccessCallout messages={props.toasts ?? {}} />
    {props.back && <>
      <NavigationBar back={props.back} />
      <Spacer />
    </>}
    <div className={cn("flex flex-col gap-12 max-w-120 text-sm grow", props.className)}>
      {props.children}
    </div>
  </>
}

export function SimpleCenterPage(props: {
  children?: ReactNode,
  className?: string
}) {
  return <>
    <div className={cn("flex flex-col gap-12 max-w-120 text-sm grow justify-center self-center mb-20 items-center text-center", props.className)}>
      {props.children}
    </div>
  </>
}

