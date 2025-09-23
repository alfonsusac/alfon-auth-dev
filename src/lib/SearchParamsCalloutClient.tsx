"use client"

import { useSearchParams } from "next/navigation"

export function SuccessCallout(props: {
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

export function ErrorCallout<T extends (...args: any) => any>(props: {
  messages: {
    [K in Extract<Awaited<ReturnType<T>>, string>]: string
  }
}) {
  const sp = useSearchParams()
  const error = sp.get('error')
  if (typeof error === 'string') {
    const message = props.messages?.[error as Extract<Awaited<ReturnType<T>>, string>] ?? error
    return <div className="callout error animate-fade-in">{message}</div>
  }
  return <></>
}