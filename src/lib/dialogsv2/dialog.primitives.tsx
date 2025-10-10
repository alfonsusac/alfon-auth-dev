import { cn } from "lazy-cn"
import type { ComponentProps } from "react"
import { ModalClose } from "./modal.client"
import { IconClose } from "../../shared/icons"

export function DialogSurface(props: ComponentProps<"div"> & {
  wide?: boolean,
  wider?: boolean,
}) {
  const { wide, wider, ...rest } = props
  return <div {...rest} className={cn(
    "relative p-6 bg-background rounded-xl shadow-2xl",
    "w-full max-w-80",
    "overflow-y-auto",
    "min-h-0 min-w-0",
    "shrink",
    "max-h-full",
    props.wide && "p-8 max-w-100",
    props.wider && "p-12 max-w-140",
    props.className,
  )} />
}

export function DialogCloseButton(props: ComponentProps<typeof ModalClose>) {
  return (
    <ModalClose
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
    </ModalClose>
  )
}

export function SubpageSurface(props: ComponentProps<"div">) {
  return <DialogSurface {...props} className={cn(
    'max-w-2xl w-full h-full',
    'flex flex-col overflow-hidden p-0',
    'relative',
    props.className)} />
}

export function DialogTitle(props: ComponentProps<"h2">) {
  return <h2 {...props} className={cn("text-lg font-semibold mb-4", props.className)} />
}
