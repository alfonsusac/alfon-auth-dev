import { use, type ComponentProps } from "react"
import { FormButton } from "../lib/FormButton"
import { toNativeSearchParams } from "../lib/next/next-search-params"
import { ErrorCallout } from "../lib/next/next-search-param-toast.client"
import { type FormType } from "../lib/formv2/form"
import type { ActionParameter } from "../lib/formv2/form-action"
import { FormWithProgressiveRedirect } from "../lib/formv2/form-redirect"
import { cn } from "lazy-cn"
import { InputFields, type FieldMap } from "../lib/formv2/input-fields/input-fields"
import { formAction } from "./form-action"
import { searchParams } from "@/lib/next/next-page"

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
export type ResultHandler<F extends FormType, R> = (data: {
  result: Exclude<F['$result'], string>,
  inputs: ActionParameter<F['fields']>,
}) => Promise<R>


export type FormProps<F extends FormType> = {
  form: F,
  searchParams?: PageSearchParams
  onSuccess: ResultHandler<F, void>,
}


export async function Form<F extends FormType>(props:
  & FormProps<F>
) {
  const sp = await searchParams()

  return <FormWithProgressiveRedirect
    className="flex flex-col gap-6"
    action={formAction.bind(null, {
      form: props.form,
      onSuccess: props.onSuccess,
    })}
  >
    <InputFields // TODO : determine why this needs searchParams. It shouldn't. Also, move to form v2 folder
      fields={props.form.fields}
      classNames={{ inputBox: "small" }}
      searchParams={toNativeSearchParams(sp)} />

    <ErrorCallout messages={props.form.errorMessages ?? {}} />

    <FormButton
      className="button primary px-6 self-end small"
      loading="Saving...">Save</FormButton>

  </FormWithProgressiveRedirect>
}









