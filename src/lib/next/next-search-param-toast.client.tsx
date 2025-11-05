"use client"

import { cn } from "lazy-cn"
import { useSearchParams } from "next/navigation"
import { IconCheckFilled } from "../../shared/icons"
import type { ReactNode } from "react"
import { useSuccessToast } from "../page-context/page-context-next-search-params-toast"

export function SuccessCallout(props: {
  messages: Record<string, ReactNode>
}) {

  const [message, id] = useSuccessToast({
    messages: props.messages,
    key: 'success'
  })

  if (!message) return <></>

  return <div
    key={id}
    className={cn(
      "toast-container",
      "pointer-events-none",
    )}
  >
    <div className={cn(
      "toast-item",
      "animate-toast",
      "pointer-events-auto"
    )}>
      <IconCheckFilled className="animate-toast-check h-[1lh] w-[1.5ch] shrink-0" />
      <div>{message}</div>
    </div>
  </div>
}









type ExtractErrorFromRes<T extends (...args: any) => any> = Extract<Awaited<ReturnType<T>>, string>
type ExtractErrorKeysFromRes<T extends string> = T extends `${ infer V }=${ string }` ? V : T
export type GetErrorValueFromErrorRes<T extends string> = T extends `${ string }=${ string }` ? `${ string }$1${ string }` : string

export type ExtractErorrMessageMapFromRes2<T extends string> = {
  [K in T as ExtractErrorKeysFromRes<K>]: GetErrorValueFromErrorRes<K>
}
export type ExtractErrorMessageMapFromRes<T extends (...args: any) => any> = {
  [K in ExtractErrorFromRes<T> as ExtractErrorKeysFromRes<K>]: GetErrorValueFromErrorRes<K>
}

export function ErrorCallout<T extends (...args: any) => any>(props: {
  messages: ExtractErrorMessageMapFromRes<T>
}) {
  const sp = useSearchParams()
  const error = sp.get('error')
  if (typeof error === 'string') {
    const messageOrMessageFn = props.messages?.[error.split('=')[0] as ExtractErrorKeysFromRes<ExtractErrorFromRes<T>>] ?? error

    if (error.includes('=')) {
      const [, msg] = error.split('=')
      const message = messageOrMessageFn.replace('$1', msg)
      return <div className="callout error animate-fade-in">
        {message}
      </div>
    }

    return <div className="callout error animate-fade-in">
      {messageOrMessageFn}
    </div>
  }
  return <></>
}