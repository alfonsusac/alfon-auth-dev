import { cn } from "lazy-cn"
import type { ComponentProps } from "react"

export function InputGroup(props: ComponentProps<"div">) {
  return <div {...props} className={cn('input-group', props.className)} />
}