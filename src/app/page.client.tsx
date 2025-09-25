"use client"

import { useEffect, useState } from "react"

export function ScreenSize() {

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-50">
      {`Screen: ${ window.innerWidth }x${ window.innerHeight }`}
    </div>
  )
}