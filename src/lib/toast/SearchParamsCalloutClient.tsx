"use client"

import { cn } from "lazy-cn"
import { useSearchParams } from "next/navigation"
import type { SVGProps } from "react"

export function ToastBanner(props: {
  messages: Record<string, string>
}) {
  const sp = useSearchParams()
  const value = sp.get('success')
  const [code, id] = value?.split(' ') ?? []
  if (typeof value === 'string') {
    const message = props.messages?.[code] ?? code
    return <div key={id} className="callout success animate-[fade-in_1s_cubic-bezier(0,_0,_0.2,_1)]">{message}</div>
  }
  return <></>
}

export function SuccessCallout(props: {
  messages: Record<string, string>
}) {

  const sp = useSearchParams()
  const value = sp.get('success')
  const [code, id] = value?.split(' ') ?? []
  if (typeof value === 'string') {
    const message = props.messages?.[code] ?? code
    return <div
      key={id}
      className={cn(
        "toast-container",
      )}
    >
      <div className={cn(
        "toast-item",
        "animate-toast"
      )}>
        <MaterialSymbolsCheck className="animate-toast-check h-[1lh] w-[1.5ch] shrink-0" />
        <div>{message}</div>
      </div>
    </div>
  }
  return <></>
}

export function MaterialSymbolsCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" /></svg>
  )
}
export function LineMdConfirm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt */}<path fill="none" stroke="currentColor" strokeDasharray="24" strokeDashoffset="24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11l6 6l10 -10"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" /></path></svg>
  )
}
export function LineMdCircleFilledToConfirmCircleFilledTransition(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt */}<mask id="SVGhM8NHeAh"><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path fill="#fff" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z" /><path stroke="#000" strokeDasharray="14" strokeDashoffset="14" d="M8 12l3 3l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="14;0" /></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#SVGhM8NHeAh)" /></svg>
  )
}









type ExtractErrorFromRes<T extends (...args: any) => any> = Extract<Awaited<ReturnType<T>>, string>
type ExtractErrorKeysFromRes<T extends string> = T extends `${ infer V }=${ string }` ? V : T
type GetErrorValueFromErrorRes<T extends string> = T extends `${ string }=${ string }` ? `${ string }$1${ string }` : string

export function ErrorCallout<T extends (...args: any) => any>(props: {
  test?: T extends (...args: any) => (infer U | Promise<infer U>)
  ? U extends string ? U extends `${ infer V }=${ string }` ? `${ V }=` : U : never : never
  messages: {
    [K in ExtractErrorFromRes<T> as ExtractErrorKeysFromRes<K>]: GetErrorValueFromErrorRes<K>
  }
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