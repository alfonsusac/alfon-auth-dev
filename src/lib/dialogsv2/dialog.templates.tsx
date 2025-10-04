import type { ReactNode } from "react"
import type { ModalServerContext } from "./modal"
import { DialogCloseButton, SubpageSurface } from "./dialog.primitives"
import { ModalContent } from "./modal.client"

export function SubpageOverlay(props: {
  children: ReactNode,
}) {
  return (
    <ModalContent>
      <SubpageSurface>
        <DialogCloseButton />
        <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
          <div className="w-full flex flex-col gap-12">
            {props.children}
          </div>
        </div>
      </SubpageSurface>
    </ModalContent>
  )
}