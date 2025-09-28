
import { type ComponentProps, type ReactNode } from "react"
import { cn } from "lazy-cn"
import { DialogButtonBase, DialogJustButtonBase } from "./dialog.client"
import { Link } from "../link/link"
import { SearchParamModal } from "../sp-modal/search-param-modal.client"
import { IconClose } from "../icons"


export function Dialog(props: {
  name: string,
  context?: PageContext,
  children?: (
    Button: (props: Omit<ComponentProps<typeof DialogJustButtonBase>, 'href' | 'context'>) => ReactNode,
    Content: (props: {
      children?: ReactNode,
      hideCloseButton?: boolean,
      wide?: boolean,
      className?: string
    }) => ReactNode
  ) => ReactNode
}) {
  const { name, context, children } = props

  //   // TODO - u can pass children from props instead of return components
  //   // TODO? Custom Close Button that resets specific search params

  return <>
    {children?.(
      props =>
        <DialogJustButtonBase {...props}
          href={`?${ name }`}
          context={context}
        />,

      props =>
        <SearchParamModal name={name}>
          <DialogBackdropLink context={context} />

          {/* Actual Paper */}
          <DialogJustPaper className={cn(
            props.wide && "p-8 max-w-(--dialog-wide-w)",
          )}>
            {!props.hideCloseButton && <DialogCloseButton />}
            {props.children}
          </DialogJustPaper>

        </SearchParamModal>
    )}
  </>
}

export function DialogJustPaper(props: ComponentProps<"div">) {
  return <div {...props}
    className={cn(
      "relative p-6 bg-background rounded-xl shadow-2xl ",
      "w-full max-w-(--dialog-w)",
      "overflow-y-auto",
      props.className,
    )}
  />

}



// -- Primitives --------

export function DialogTitle(props: ComponentProps<"h2">) {
  return <h2 {...props} className={cn("text-lg font-semibold mb-4", props.className)} />
}


export function DialogButton(props: ComponentProps<typeof DialogButtonBase>) {
  return <DialogButtonBase {...props} />
}


export function DialogBackdropLink(props: {
  className?: string
  context?: { [key: string]: string }
}) {
  return <Link
    context={props.context}
    className={cn(
      "absolute top-0 left-0 w-full h-full bg-foreground/25",
      props.className,
    )}
    href={"?"}
    scroll={false}
    client
  />
}


export function DialogCloseButton(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "absolute top-2 right-2",
        "text-lg text-foreground-body/50 hover:text-foreground-body w-8 h-8 flex items-center justify-center",
        props.className
      )}
      href={props.href ?? "?"}
      scroll={props.scroll ?? false}
      client={props.client ?? true}
    >
      {props.children ?? <IconClose />}
    </Link>
  )
}




