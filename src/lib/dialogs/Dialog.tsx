
import { type ComponentProps, type ReactNode, type SVGProps } from "react"
import { cn } from "lazy-cn"
import { DialogButtonBase } from "./Dialog.client"
import { Link } from "../link/Link"

export function DialogButton(props: ComponentProps<typeof DialogButtonBase>) {
  return <DialogButtonBase {...props} />
}

export function DialogPaper(props: ComponentProps<"div"> & {
  title?: ReactNode
  wide?: boolean
}) {
  const { title, wide, ...rest } = props
  return <div
    {...rest}
    className={cn(
      "absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-[20rem] max-[20rem]:rounded-none",
      // wide && "p-8 max-w-96",
      wide && "p-8 max-w-sm max-[24rem]:rounded-none",
      props.className
    )}
  >
    {props.title && <h2 className="text-lg font-semibold mb-4">{props.title}</h2>}
    {props.children}

    <Link
      className="absolute top-2 right-2 text-lg text-foreground-body/50 hover:text-foreground-body w-8 h-8 flex items-center justify-center"
      href={"?"}
      scroll={false}
      client
    >
      <MaterialSymbolsCloseRounded />
    </Link>
  </div>
}



export function MaterialSymbolsCloseRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" /></svg>
  )
}