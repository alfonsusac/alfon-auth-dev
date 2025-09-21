import type { ReactNode } from "react"

export async function SPCallout(props: {
  sp: Promise<{ [key: string]: string | string[] | undefined }>
  match: `${ string }=${ string }`
  className: string,
  children: ReactNode
}) {
  const sp = await props.sp
  const [key, ...rest] = props.match.split('=')
  const value = rest.join('')
  if (sp[key] === value) {
    return <div className={"callout " + props.className}>{props.children}</div>
  }
  return <></>
}

export async function ErrorCallout<T extends (...args: any) => any>(props: {
  sp: Promise<{ [key: string]: string | string[] | undefined }>
  messages: {
    [K in Extract<Awaited<ReturnType<T>>, string>]: string
  }
}) {
  const sp = await props.sp
  const error = sp['error']
  if (typeof error === 'string') {
    const message = props.messages?.[error as Extract<Awaited<ReturnType<T>>, string>] ?? error
    return <div className="callout error">{message}</div>
  }
  return <></>
}