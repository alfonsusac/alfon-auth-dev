import type { ReactNode } from "react"
import { DangerSymbol } from "./DangerSymbol"
import { Form } from "./basic-form/Form"
import { Link } from "./link/link"
import { FormButton } from "./FormButton"

export function DeleteAlert(props: {
  title: ReactNode,
  description: ReactNode,
  actionLabel: ReactNode,
  action: () => Promise<void>,
  backHref: string,
}) {
  return (
    <section className="flex flex-col gap-2 max-w-80">
      <DangerSymbol />
      <p className="text-pretty font-semibold tracking-tight text-foreground-body">
        {props.title}
      </p>
      <p className="text-pretty text-xs text-foreground-body">
        {props.description}
      </p>
      <div className="flex gap-2 my-2">
        <Link href={props.backHref} className="button ghost" autoFocus>Cancel</Link>
        <Form action={props.action}>
          <button className="button destructive-primary">{props.actionLabel}</button>
        </Form>
      </div>
    </section>
  )
}

export function DeleteAlert2(props: {
  title: ReactNode,
  description: ReactNode,
  actionLabel: ReactNode,
  action: () => Promise<void>,
  backHref: string,
  context?: { [key: string]: string }
}) {
  return (
    <section className="flex flex-col gap-6 items-center">

      <div className="max-w-60 text-center flex flex-col items-center gap-2 px-4">
        <DangerSymbol />
        <p className="text-pretty font-semibold tracking-tight text-foreground-body">
          {props.title}
        </p>
        <p className="text-pretty text-xs text-foreground-body">
          {props.description}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 my-2 self-stretch">
        <Form action={props.action}>
          <FormButton
            loading="Deleting..."
            className="button destructive-primary small self-stretch w-full">{props.actionLabel}</FormButton>
        </Form>
        <Link href={props.backHref} replace scroll={false} className="button ghost small self-stretch w-full" autoFocus context={props.context} client>Cancel</Link>
      </div>
    </section>
  )
}