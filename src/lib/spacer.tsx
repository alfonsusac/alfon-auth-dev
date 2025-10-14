import { cn } from "lazy-cn"

export function Spacer(props: {
  half?: boolean,
  quarter?: boolean,
  sixth?: boolean,
}) {
  return <div className={cn(
    "h-12",
    props.half && "h-6",
    props.quarter && "h-3",
    props.sixth && "h-2",
  )} />
}