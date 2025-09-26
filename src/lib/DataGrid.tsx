import { cn } from "lazy-cn"
import { Fragment } from "react"
import { formatDate } from "./date"

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
      "grid grid-cols-[auto_1fr] page-subtitle mt-3 gap-1 gap-x-4",
      props.className
    )}>

      {Object.entries(props.data).map(entry => {
        const [key, value] = entry
        if (typeof value === "string") {
          return (
            <Fragment key={key}>
              <div className="opacity-50 whitespace-nowrap">{key}</div>
              <div className="break-words min-w-0">{String(value)}</div>
            </Fragment>
          )
        }
        if (value instanceof Date) {
          return (
            <Fragment key={key}>
              <div className="opacity-50 whitespace-nowrap">{key}</div>
              <div className="break-words min-w-0">{formatDate(value)}</div>
            </Fragment>
          )
        }
        if (value === null) {
          return (
            <Fragment key={key}>
              <div className="opacity-50 whitespace-nowrap">{key}</div>
              <div className="opacity-50 italic">null</div>
            </Fragment>
          )
        }

        return <></>
      })}

    </div>
  )
}