import type { ComponentProps } from "react"
import { DialogJustButtonBase } from "./dialog.client"
import { DialogBackdropLink, DialogCloseButton, DialogJustPaper } from "./dialog"
import { SearchParamModal } from "../sp-modal/search-param-modal.client"
import { cn } from "lazy-cn"

export function SubPage(props: {
  name: string,
  context?: PageContext,
  children?: (
    Button: (props: Omit<ComponentProps<typeof DialogJustButtonBase>, 'href' | 'context'>) => React.ReactNode,
    Content: (props: {
      children?: React.ReactNode
      className?: string
    }) => React.ReactNode
  ) => React.ReactNode
}) {
  const { name, context, children } = props
  // TODO - u can pass children from props instead of return components
  //   // TODO? Custom Close Button that resets specific search params

  return <>
    {children?.(
      props =>
        <DialogJustButtonBase {...props}
          href={`?${ name }`}
          context={context}
        />,
      props =>
        <SearchParamModal name={name} className={cn(
          "p-4 xs:p-12 sm:p-20"
        )}>
          <DialogBackdropLink context={context} />

          <DialogJustPaper className={cn(
            "max-w-2xl w-full h-full",
            "flex flex-col overflow-hidden p-0",
            "relative",
          )}>
            <DialogCloseButton className="absolute" context={context} />
            <div className="shrink basis-0 grow min-h-0 overflow-y-auto p-8 pt-14 xs:p-12 xs:pt-18 sm:p-20 flex flex-col items-center">
              <div className="w-full">
                {props.children}
              </div>
            </div>
          </DialogJustPaper>

        </SearchParamModal>

    )}
  </>

}