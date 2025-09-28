"use client"

import { useSearchParams } from "next/navigation"
import { Link } from "../link/Link"
import { cn } from "lazy-cn"
import { DialogBackdropLink, DialogCloseButton, DialogJustPaper } from "../dialogs/Dialog"
import { DialogRoot } from "../dialogs/Dialog.client"

export function SupPageSearchParamDialog(props: {
  name: string,
  children?: React.ReactNode
  context?: PageContext
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === ''

  return (
    <DialogRoot show={show}>
      <DialogBackdropLink context={props.context} />

      <div className={cn(
        "pointer-events-none absolute top-0 left-0 w-screen h-screen",
        "flex items-center justify-center p-4 xs:p-12 sm:p-20"
      )}>
        <DialogJustPaper className={cn(
          (show) ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
          "max-w-2xl w-full h-full",
          "flex flex-col overflow-hidden p-0",
          "relative",
        )}>
          <DialogCloseButton className="absolute" context={props.context} />
          <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
            <div className="w-full">
              {(show) && <div className="modal-opened" />}
              {props.children}
            </div>
          </div>
        </DialogJustPaper>
      </div>
    </DialogRoot>
  )
}


export function SuppageClient(props: {
  name: string,
  button: React.ReactNode,

  children?: React.ReactNode
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === ''

  return <>
    <Link
      href={`?${ props.name }`}
      scroll={false}
      client
    // onClick={() => setOpened(true)}
    >
      {props.button}
    </Link>

    <DialogRoot show={show}>
      <DialogBackdropLink />

      <div className={cn(
        "pointer-events-none absolute top-0 left-0 w-screen h-screen",
        "flex items-center justify-center p-4 xs:p-12 sm:p-20"
      )}>
        <DialogJustPaper className={cn(
          (show) ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
          "max-w-2xl w-full h-full",
          "flex flex-col overflow-hidden p-0",
          "relative",
        )}>
          <DialogCloseButton className="absolute" />
          <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
            <div className="w-full">
              {(show) && <div className="modal-opened" />}
              {props.children}
            </div>
          </div>
        </DialogJustPaper>
      </div>
    </DialogRoot>
    {/* 
    <div className={cn(
      (show) ? "" : "pointer-events-none opacity-0",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center"
    )}>
      <DialogBackdropLink />

      <div className={cn(
        "pointer-events-none absolute top-0 left-0 w-screen h-screen",
        "flex items-center justify-center p-4 xs:p-12 sm:p-20"
      )}>
        <DialogJustPaper className={cn(
          (show) ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
          "max-w-2xl w-full h-full",
          "flex flex-col overflow-hidden p-0",
          "relative",
        )}>
          <DialogCloseButton className="absolute" />
          <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
            <div className="w-full">
              {(show) && <div className="modal-opened" />}
              {props.children}
            </div>
          </div>
        </DialogJustPaper>
      </div>

    </div> */}

  </>


}