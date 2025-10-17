import type { ComponentProps } from "react"
import { FormButton } from "../FormButton"
import { actionResolveError } from "../redirects"
import { actionNavigate } from "../navigate"
import { toNativeSearchParams } from "../searchParams"
import { ErrorCallout } from "../toast/search-param-toast.client"
import { type FormType } from "./form"
import type { ActionParameter } from "./form-action"
import { FormWithProgressiveRedirect } from "./form-redirect"
import { cn } from "lazy-cn"
import { InputFields, type FieldMap } from "./input-fields/input-fields"
import { formDataToTypedInput } from "./input-fields/input-fields-util"

// Just Server Buttons

export function ActionButton(props: ComponentProps<typeof FormButton> & {
  action: () => Promise<void>,
  loading: string,
}) {
  const { action, loading, ...rest } = props
  return <FormWithProgressiveRedirect action={action} className={props.className}>
    <FormButton {...rest}
      className={cn("button", props.className)}
      loading={props.loading} />
  </FormWithProgressiveRedirect>
}



// Complete Form Package

export type DefaultValues<F extends FieldMap> = Partial<Record<keyof F, any>>
export type Values<F extends FieldMap> = Partial<Record<keyof F, any>>
export type ResultHandler<F extends FieldMap, R> = (data: {
  result: Exclude<F['$result'], string>,
  inputs: ActionParameter<F>,
}) => Promise<R>

export type FormProps<F extends FormType> = {
  form: F,
  searchParams?: PageSearchParams
  navigateOnSubmit?: ResultHandler<F['fields'], string>,
  onSubmit: ResultHandler<F['fields'], void>,
}
export function Form<F extends FormType>(props: FormProps<F>) {
  return <FormWithProgressiveRedirect
    className="flex flex-col gap-6"
    action={async (form) => {
      "use server"
      const inputs = formDataToTypedInput(form, props.form.fields as F['fields'])
      const response = await props.form.action(inputs) as F['$result']
      const result = actionResolveError(response, inputs)
      await props.onSubmit?.({ result, inputs })
      props.navigateOnSubmit && actionNavigate(await props.navigateOnSubmit({ result, inputs }))
    }}
  >
    <InputFields // TODO : determine why this needs searchParams. It shouldn't. Also, move to form v2 folder
      fields={props.form.fields}
      classNames={{ inputBox: "small" }}
      searchParams={props.searchParams && toNativeSearchParams(props.searchParams)} />

    <ErrorCallout messages={props.form.errorMessages ?? {}} />

    <FormButton
      className="button primary px-6 self-end small"
      loading="Saving...">Save</FormButton>

  </FormWithProgressiveRedirect>
}











