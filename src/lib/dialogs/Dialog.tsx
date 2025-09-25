
import { type ComponentProps, type ReactNode } from "react"
import { cn } from "lazy-cn"
import { DialogButtonBase } from "./Dialog.client"

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
      "absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-80",
      wide && "p-8 max-w-96",
      props.className
    )}
  >
    {props.title && <h2 className="text-lg font-semibold mb-4">{props.title}</h2>}
    {props.children}
  </div>
}
