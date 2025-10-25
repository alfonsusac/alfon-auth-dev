import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"

export function useSuccessToast(props: {
  key: string,
  messages: Record<string, ReactNode>
}) {
  const sp = useSearchParams()
  const value = sp.get(props.key)
  const [code, id] = value?.split(' ') ?? []
  if (typeof value !== 'string')
    return [null, null] as  const

  const message = props.messages?.[code] ?? code
  return [message, id] as const
}