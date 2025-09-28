
import { type ComponentProps, type ReactNode, type SVGProps } from "react"
import { cn } from "lazy-cn"
import { DialogButtonBase, DialogJustButtonBase, SearchParamDialog } from "./Dialog.client"
import { Link } from "../link/Link"
import { SearchParamModal } from "../sp-modal/SearchParamModal.client"


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

export function DialogBoundingBox(props: ComponentProps<"div">) {
  return <div {...props} className={cn(
    "max-h-screen max-w-screen",
    "flex flex-col",
    "p-4",
    props.className,
  )} />
}


// -- Primitives --------

export function DialogTitle(props: ComponentProps<"h2">) {
  return <h2 {...props} className={cn("text-lg font-semibold mb-4", props.className)} />
}


export function DialogButton(props: ComponentProps<typeof DialogButtonBase>) {
  return <DialogButtonBase {...props} />
}




// export function DialogPaper2(props: ComponentProps<"div"> & {
//   title?: ReactNode,
//   hideCloseButton?: boolean,
//   wide?: boolean,
//   context?: { [key: string]: string }
// }) {
//   const { title, hideCloseButton, wide, ...rest } = props

//   return <>
//     <DialogBackdropLink
//       context={props.context}
//       className={cn(
//         "opacity-0",
//         "in-[[data-show]]:opacity-150",
//         "transition-opacity duration-80 ease-linear",
//       )}
//     />
//     <div className={cn(
//       "opacity-0 scale-90",
//       "in-[[data-show]]:opacity-150",
//       "in-[[data-show]]:scale-100",
//       "transition duration-80 ease-linear",

//       "max-h-screen max-w-screen",
//       "flex flex-col",
//       "p-4",
//     )}>
//       <div
//         className={cn(
//           "relative p-6 bg-background rounded-xl shadow-2xl ",
//           "w-full max-w-(--dialog-w)",
//           wide && "p-8 max-w-(--dialog-wide-w)",
//           "overflow-y-auto",
//           props.className,
//         )}
//       >

//         {!hideCloseButton && <DialogCloseButton />}
//         {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
//         {props.children}
//       </div>
//     </div>
//   </>

// }

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
      {props.children ??
        <MaterialSymbolsCloseRounded />
      }
    </Link>
  )
}

export function MaterialSymbolsCloseRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" /></svg>
  )
}

