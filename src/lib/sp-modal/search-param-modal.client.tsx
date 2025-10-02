"use client"

import { cn } from "lazy-cn"
import { useSearchParams } from "next/navigation"
import { createContext, use, type ComponentProps } from "react"


// The Search Param Modal

export function SearchParamModal(props: {
  name: string,
  children?: React.ReactNode,
  className?: string
}) {
  const sp = useSearchParams()
  const show = sp.get(props.name) === ''

  return <searchparammodalcontext.Provider value={{
    name: props.name,
    show
  }}>
    <ModalShell show={show} className={props.className}>
      {props.children}
    </ModalShell>
  </searchparammodalcontext.Provider>
}

function ModalShell({ show, ...props }: ComponentProps<"div"> & {
  show: boolean
}) {
  const modal = use(searchparammodalcontext)
  if (!modal) throw new Error("<ModalShell> must be used within a <SearchParamModal>")

  return <div
    {...props}
    data-show={show ? "" : undefined}
    className={cn(
      // Animated
      "transition-all duration-50",
      show ? "" : "duration-100",

      // Base
      show ? "modal-opened pointer-events-auto" : "pointer-events-none opacity-0 select-none",
      "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)",
      "flex items-center justify-center",
      props.className,
    )}
  />
}



// The Search Param Modal > Context

export const searchparammodalcontext = createContext(null as null | {
  name: string,
  show: boolean
})