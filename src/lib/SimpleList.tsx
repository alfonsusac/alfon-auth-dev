import { cn } from "lazy-cn"
import type { ComponentProps } from "react"
import { Link } from "./link/Link"

export function List(props: ComponentProps<"ul">) {
  return (
    <ul {...props} className={cn("list", props.className)} />
  )
}

export function ListItem(props: ComponentProps<"li">) {
  return (
    <li {...props} className={cn("relative group")} />
  )
}