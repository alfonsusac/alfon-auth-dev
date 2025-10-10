import { cn } from "lazy-cn"
import { Fragment } from "react"
import { formatDate } from "./date"
import { DateTime } from "./date.ui"

export function DataGridDisplay<
  T extends object
>(
  props: {
    data: T,
    className?: string
  }
) {
  return (
    <div className={cn(
      "grid grid-cols-[auto_1fr] page-subtitle gap-1 gap-x-4 my-2",
      props.className
    )}>

      {Object.entries(props.data).map(entry => {
        const [key, value] = entry
        if (typeof value === "string") {
          return (
            <Fragment key={key}>
              <div className="text-foreground-muted whitespace-nowrap">{key}</div>
              <div className="break-words min-w-0">{String(value) || <span className="text-foreground-muted">-</span>}</div>
            </Fragment>
          )
        }
        if (value instanceof Date) {
          return (
            <Fragment key={key}>
              <div className="text-foreground-muted whitespace-nowrap">{key}</div>
              <div className="break-words min-w-0"><DateTime date={value} /></div>
            </Fragment>
          )
        }
        if (value === null) {
          return (
            <Fragment key={key}>
              <div className="text-foreground-muted whitespace-nowrap">{key}</div>
              <div className="text-foreground-muted italic">null</div>
            </Fragment>
          )
        }

        return (
          <Fragment key={key}>
            <div className="text-foreground-muted whitespace-nowrap">{key}</div>
            <div className="">{value}</div>
          </Fragment>
        )
      })}

    </div>
  )
}