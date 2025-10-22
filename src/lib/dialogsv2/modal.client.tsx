"use client"

import { createContext, use, type ComponentProps, type ReactNode } from "react"
import { Link } from "../link/link"
import { cn } from "lazy-cn"

// Scope & Assumptions:
// - client mechanism to show/hide dialog based on search params.
// - style are in separate "dumb" primitives that will be packaged in separate files.
// - any "dialogs" using searchparams will be modal therefore backdrop will need to be implemented.

// Approach:
// 1. make the dumbest client component that just shows/hides based on search params
// 2. a modal will need means to open and close it.
//     - buttons to open and close it
//     - content to show the dialog
// 3. a modal needs to have backdrop to prevent interaction with the rest of the page
//     - backdrop component
// 4. share any remaining api that needs to be exposed

// Goal:
// - to make it look like this
// 
//    <Dialog name="edit">
//      <Dialog.Button>Open</Dialog.Button>
//      <Dialog.Content>...</Dialog.Content>
//    </Dialog>
//    
//    when closed, the url is /path,      no-js dont show Content
//    when opened, the url is /path?edit, no-js would show Content


// #1
import { useSearchParams } from "next/navigation"
import { reactContext } from "../react/react-context"

export type ModalContext = { name: string, show: boolean }
export type ModalContentContext = { context: { [key: string]: string } }
const modalContext = reactContext<ModalContext>()
const modalContentContext = reactContext<ModalContentContext>()

export function ModalBase(props: {
  name: string, // initialize the key of the search params
  children?: ReactNode, // who will consume this show/hide state
  must_be_called_in_Modal_Component: "must_be_called_in_Modal_Component" // just a marker to avoid direct usage
}) {
  const sp = useSearchParams()
  const name = props.name
  const show = sp.get(props.name) === ''

  return <>
    <modalContext.Provider value={{ name, show }}>
      {props.children}
    </modalContext.Provider>
  </>
}


// #2
export function ModalButton(props: ComponentProps<typeof Link> & { name?: string }) {
  const { name, ...rest } = props
  const modal = use(modalContext.context)
  const parentContext = use(modalContentContext.context)
  const hrefName = name || modal?.name
  return <>
    <Link {...rest} href={`?${ hrefName }`} scroll={false} client context={parentContext?.context} />
  </>
}

export function ModalClose(props: ComponentProps<typeof Link>) {
  const modal = useSearchParamModal()
  const parentContext = use(modalContentContext.context)
  const context = { ...parentContext?.context }
  delete context[modal.name]

  return <>
    <Link {...props} href={'?'} scroll={false} client context={context} />
  </>

}


// #2 extras
export function ModalBackdrop(props: ComponentProps<typeof ModalClose> & { show: boolean }) {
  const { show, ...rest } = props
  return <>
    <ModalClose {...rest} className={cn(
      "absolute inset-0 bg-black/50",
      show
        ? "opacity-100 pointer-events-auto modal-opened"
        : "opacity-0 pointer-events-none",
      "transition-opacity duration-200",
      props.className
    )} />
  </>
}




// #3

// Constraints:
// - Clicking on Modal Backdrop should close the modal so it needs to be a Link
// - Can't have children as render function becasuse it won't be usable in server components.
// - Modal Backdrop must be separate from children because Link cannot be nested
// - Modal Backdrop is a must otherwise the rest of the page is still interactive

export function ModalContent(props: { children?: ReactNode, className?: string }) {
  const modal = useSearchParamModal()
  const parentContext = use(modalContentContext.context)
  const context = { ...parentContext?.context, [modal.name]: '' }
  return <>
    <modalContentContext.Provider value={{ context }}>
      <div className={cn(props.className,
        "fixed inset-0 z-999 pointer-events-none max-w-screen max-h-screen",
        "flex flex-col items-center justify-center",
        modal.show ? "*:pointer-events-auto" : "*:pointer-events-none",
        "*:max-h-full",
        "p-10",
      )} >
        <ModalBackdrop show={modal.show} />

        {modal.show ? props.children : null}
      </div>
    </modalContentContext.Provider>
  </>
}



// #4
export const useSearchParamModal = modalContext.use
export const useSearchParamModalContent = modalContentContext.use






















// The Dialog

export function Dialog2(props: { // todo: rename to Dialog
  name: string,
  children?: ReactNode,
  context?: { [key: string]: string }
}) {
  const { name, children, context } = props

  return <dialogcontext.Provider value={{ name, context }}>
    {children}
  </dialogcontext.Provider>
}



// The Dialog > Dialog Context

const dialogcontext = createContext(null as null | {
  name: string,
  context?: { [key: string]: string }
})
export function useDialog() {
  const dialog = use(dialogcontext)
  if (!dialog) throw new Error("useDialog() must be used within a <Dialog>")
  return dialog
}



// The Dialog > Dialog Context Consumers > button

export function DialogButton2(props: {
  children?: ReactNode
}) {
  const dialog = useDialog()

  return <Link
    href={`?${ dialog.name }`}
    scroll={false}
    client
    context={dialog.context}
  >
    {props.children} - {dialog.name} - {JSON.stringify(dialog.context)}
  </Link>

}



// The Dialog > Dialog Context Consumers > content

// export function DialogContent(props: {
//   children?: ReactNode,
//   wide?: boolean,
//   wider?: boolean,
//   className?: string,
// }) {
//   const dialog = useDialog()

//   return <ModalBase name={dialog.name}>
//     <DialogBackdropLink context={dialog.context} />
//     <DialogJustPaper className={cn(
//       props.wide && "p-8 max-w-100",
//       props.wider && "p-12 max-w-140",
//       props.className
//     )}>
//       <DialogCloseButton context={dialog.context} />
//       {props.children}
//     </DialogJustPaper>
//   </ModalBase>

// }

