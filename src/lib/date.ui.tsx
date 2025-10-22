"use client"

import { useEffect, useState } from "react"
import { timeAgo } from "./core/time-ago"


export function DateTime(props: { date: Date | string }) {

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return <>
    <noscript>{props.date.toString()}</noscript>
    {mounted && <time dateTime={new Date(props.date).toISOString()}>
      {timeAgo(new Date(props.date))}
    </time>}
  </>

}