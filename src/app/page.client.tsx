"use client"

import { useEffect, useRef, useState } from "react"

export function ScreenSize() {

  const [mounted, setMounted] = useState(false)

  const widthRef = useRef<HTMLSpanElement>(null)
  const heightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
    const onResize = () => {
      if (widthRef.current) widthRef.current.textContent = window.innerWidth.toString()
      if (heightRef.current) heightRef.current.textContent = window.innerHeight.toString()
    }
    window.addEventListener('resize', onResize)
  }, [])

  if (!mounted) return null
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="z-[999999] fixed bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-50">
      Screen: <span ref={widthRef}>{window.innerWidth}</span>×<span ref={heightRef}>{window.innerHeight}</span>
    </div>
  )
}