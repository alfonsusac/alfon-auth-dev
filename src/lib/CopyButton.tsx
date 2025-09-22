"use client"

import { useState } from "react"

export function copyButtonAction(text: string) {
  return async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault()
    await navigator.clipboard.writeText(text)
  }
}

export function CopyButton(props: React.ComponentProps<"button"> & {
  text: string
}) {
  const [isCopied, setCopied] = useState(false)

  return <button {...props} onClick={async function (ev) {
    props.onClick?.(ev)
    if (ev.defaultPrevented) return
    ev.stopPropagation()
    await navigator.clipboard.writeText(props.text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }}>
    {isCopied
      ? <div className="flex gap-2">Copied! <div>✅</div></div>
      : <div className="flex gap-2">{props.children} <div>📑</div></div>}
  </button>
}