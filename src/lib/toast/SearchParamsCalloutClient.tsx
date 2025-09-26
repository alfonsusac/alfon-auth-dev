"use client"

import { useSearchParams } from "next/navigation"

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
      className="banner success animate-banner flex gap-2"
    >
      <div>✅</div>
      <div>{message}</div>
    </div>
  }
  return <></>
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