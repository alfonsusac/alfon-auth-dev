"use client"

import { useSearchParams } from "next/navigation"
import { Link } from "../link/Link"
import { cn } from "lazy-cn"
import { DialogCloseButton, DialogJustPaper } from "../dialogs/Dialog"
import { useEffect, useState } from "react"

export function SuppageClient(props: {
  name: string,
  button: React.ReactNode,

  children?: React.ReactNode
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === 'show'

  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (sp.get(props.name) === null) {
      setOpened(false)
    }
  }, [sp])

  return <>
    <Link
      href={`?${ props.name }=show`}
      scroll={false}
      onClick={() => setOpened(true)}
    >
      {props.button}
    </Link>

    <div className={cn(
      (opened || show) ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center"
    )}>

      <Link className={cn(
        "absolute top-0 left-0 w-full h-full bg-foreground/25"
      )}
        href={"?"}
        scroll={false}
        client
        onClick={() => setOpened(false)}
      />

      <div className={cn(
        "pointer-events-none absolute top-0 left-0 w-screen h-screen",
        "flex items-center justify-center p-4 xs:p-12 sm:p-20"
      )}>
        <DialogJustPaper className={cn(
          (opened || show) ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
          "max-w-2xl w-full h-full",
          "flex flex-col overflow-hidden p-0",
          "relative",
        )}>
          <DialogCloseButton className="absolute" onClick={() => {
            setOpened(false)
          }} />
          <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
            <div className="w-full">
              {props.children}
            </div>
          </div>
        </DialogJustPaper>
      </div>

    </div>

  </>


}