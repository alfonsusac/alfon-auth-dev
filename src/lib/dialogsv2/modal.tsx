import type { ReactNode } from "react"
import { ModalBase, ModalButton, ModalContent } from "./modal.client"

export type ModalServerContext = {
  name: string,
  context?: PageContext,
  openHref: string,
  closeHref: string,
  __modal: true,
}

export type ModalProps = {
  name: string,
  context?: PageContext,
  button?: ((button: typeof ModalButton) => ReactNode) | ReactNode,
  content: ((modal: ModalServerContext) => ReactNode) | ReactNode,
}

const ModalRoot = (props:
  & ModalProps
) => {
  const { name, context } = props

  const newContext = { ...context, [name]: '' }
  const openHref = `?${ new URLSearchParams(newContext).toString() }`
  const closeContext = { ...context }
  delete closeContext[name]
  const closeHref = `?${ new URLSearchParams(closeContext).toString() }`

  const modalContext: ModalServerContext = {
    name,
    context: newContext,
    openHref,
    closeHref,
    __modal: true,
  }

  const modalButton = typeof props.button === 'function' ? props.button(ModalButton) : props.button
  const content = typeof props.content === 'function' ? props.content(modalContext) : props.content

  // No need to pass context here again because any nesting of <Modal>
  // will get the context from the parent using useModal() in ModalBase.
  return (
    <ModalBase
      name={name}
      must_be_called_in_Modal_Component="must_be_called_in_Modal_Component"
    >
      {modalButton}
      {props.content && <ModalContent>
        {content}
      </ModalContent>}
    </ModalBase>
  )
}

const Modal = ModalRoot as typeof ModalRoot & {
  Button: typeof ModalButton
}
Modal.Button = ModalButton

export { Modal }

