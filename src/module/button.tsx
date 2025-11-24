import type { Action, ActionFn } from "@/lib/core/action"
import { FormButton } from "@/lib/FormButton"
import { FormWithProgressiveRedirect } from "@/lib/formv2/form-redirect"
import { cn } from "lazy-cn"
import type { ComponentProps, ComponentType, ReactNode } from "react"

export function Button<
  P extends ComponentType<{ className?: string, children?: ReactNode }> | keyof React.JSX.IntrinsicElements
>(props:
  & { using: P }
  & ComponentProps<P>
  & { icon?: ComponentType }
) {
  const {
    using,
    icon: Icon,
    ...rest
  } = props

  const componentProps = rest
  const Component = props.using as ComponentType<{ className?: string; children?: ReactNode }>

  const StartIcon = Icon && <div className="icon"><Icon /></div>

  const button = <Component {...componentProps} className={cn("button", rest.className)} >
    {StartIcon}
    {rest.children}
  </Component>

  return button
}



// Just Server Buttons

export function ActionButton(Props:
  & ComponentProps<typeof FormButton>
  & { action: ActionFn<[], void> }
  & { loading: string }
) {
  const { action, loading, ...rest } = Props
  return (
    <FormWithProgressiveRedirect
      action={action}
      className={Props.className}
    >
      <FormButton
        {...rest}
        className={cn("button", Props.className)}
        loading={Props.loading}
      />
    </FormWithProgressiveRedirect>
  )

}


