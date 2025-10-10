import type { ReactNode } from "react"
import { ModalBase, ModalButton, ModalContent } from "./modal.client"

export type ModalServerContext = {
  name: string,
  context?: PageContext,
  openHref: string,
  closeHref: string,
  __modal: true,
}

export function Modal(props: {
  name: string,
  context?: PageContext,
  button: (button: typeof ModalButton) => ReactNode,
  content: (modal: ModalServerContext) => ReactNode
  children?: (modal: ModalServerContext) => ReactNode
}) {
  const { name, context, children } = props

  const newContext = { ...context, [name]: '' }
  const openHref = `?${ new URLSearchParams(newContext).toString() }`
  const closeContext = { ...context }
  delete closeContext[name]
  const closeHref = `?${ new URLSearchParams(closeContext).toString() }`

  // No need to pass context here again because any nesting of <Modal>
  // will get the context from the parent using useModal() in ModalBase.
  return (
    <ModalBase
      name={name}
      must_be_called_in_Modal_Component="must_be_called_in_Modal_Component"
    >
      {props.button?.(ModalButton)}
      {props.content && <ModalContent>
        {props.content({ name, context: newContext, openHref, closeHref, __modal: true })}
      </ModalContent>}
      {children?.({ name, context: newContext, openHref, closeHref, __modal: true })}
    </ModalBase>
  )
}

