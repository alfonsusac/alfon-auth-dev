
import { type ComponentProps, type ReactNode, type SVGProps } from "react"
import { cn } from "lazy-cn"
import { DialogButtonBase } from "./Dialog.client"
import { Link } from "../link/Link"

export function DialogButton(props: ComponentProps<typeof DialogButtonBase>) {
  return <DialogButtonBase {...props} />
}

export function DialogJustPaper(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "in-[[data-show]]:[pointer-events:auto]",
        "relative p-6 bg-background rounded-xl shadow-2xl ",
        "w-full max-w-(--dialog-w)",
        "overflow-y-auto",
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}


export function DialogPaper(props: ComponentProps<"div"> & {
  title?: ReactNode,
  hideCloseButton?: boolean,
  wide?: boolean,
  context?: { [key: string]: string }
}) {
  const { title, hideCloseButton, wide, ...rest } = props

  return <>
    <DialogBackdropLink
      context={props.context}
      className={cn(
        "opacity-0",
        "in-[[data-show]]:opacity-150",
        "transition-opacity duration-80 ease-linear",
        JSON.stringify(props.context)
      )}
    />
    <div className={cn(
      "opacity-0 scale-90",
      "in-[[data-show]]:opacity-150",
      "in-[[data-show]]:scale-100",
      "transition duration-80 ease-linear",

      "[pointer-events:none]",

      "max-h-screen max-w-screen",
      "flex flex-col",
      "p-4",
    )}>
      <div
        {...rest}
        className={cn(
          "in-[[data-show]]:[pointer-events:auto]",
          "relative p-6 bg-background rounded-xl shadow-2xl ",
          "w-full max-w-(--dialog-w)",
          wide && "p-8 max-w-(--dialog-wide-w)",
          "overflow-y-auto",
          props.className,
        )}
      >

        {!hideCloseButton && <DialogCloseButton />}
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {props.children}
      </div>
    </div>
  </>

}

// export function DialogPaper2(props: ComponentProps<"div"> & {
//   title?: ReactNode
//   wide?: boolean
// }) {
//   const { title, wide, ...rest } = props
//   return <div
//     {...rest}
//     className={cn(
//       "relative p-6 bg-background rounded-xl shadow-2xl w-full max-w-[20rem] max-[20rem]:rounded-none max",
//       // wide && "p-8 max-w-96",
//       wide && [
//         "p-8 max-w-(--dialog-wide-w) max-dialogwide:rounded-none",
//         // Mobile
//         "max-dialogwide:h-full",
//         "max-dialogwide:max-h-screen",
//         // Mobile animation
//         "transition-all duration-150 ease-linear", // animation out / all
//         "max-dialogwide:in-[[data-show]]:duration-300", // animation in
//         "max-dialogwide:in-[[data-show]]:ease-out",
//         "max-dialogwide:translate-x-20",
//         "max-dialogwide:in-[[data-show]]:translate-x-0",

//         // "scale-200 origin-center",
//         // "in-[[data-show]]:scale-100",
//       ],

//       "opacity-0",
//       "in-[[data-show]]:opacity-100",

//       props.className
//     )}
//   >
//     <DialogCloseButton />

//     {props.title && <h2 className="text-lg font-semibold mb-4">{props.title}</h2>}
//     {props.children}

//   </div>
// }




export function DialogBackdropLink(props: {
  className?: string
  context?: { [key: string]: string }
}) {
  return <Link
    context={props.context}
    className={cn(
      "absolute top-0 left-0 w-full h-full bg-foreground/25",
      // "ASDF",
      JSON.stringify(props.context),
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

