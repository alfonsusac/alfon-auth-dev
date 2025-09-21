import type { ReactNode } from "react"
import { DangerSymbol } from "./DangerSymbol"

export function DeleteAlert(props: {
  title: ReactNode,
  description: ReactNode,
  actionLabel: ReactNode,
  action: () => Promise<void>,
  backHref: string,
}) {
  return (
    <section className="flex flex-col gap-2 max-w-100">
      <DangerSymbol />
      <p className="text-pretty font-semibold tracking-tight text-foreground-body">
        {props.title}
      </p>
      <p className="text-pretty text-xs text-foreground-body">
        {props.description}
      </p>
      <div className="flex gap-2 my-2">
        <a href={props.backHref} className="button">Cancel</a>
        <form action={props.action}>
          <button className="button destructive">{props.actionLabel}</button>
        </form>
      </div>
    </section>
  )
}