import type { ComponentProps } from "react"
import { UnifiedFormWithClientRedirect } from "./form.client"
import { TypedForm } from "./form.helper"
import { redirect, RedirectType } from "next/navigation"
import { resolveCustomRedirectError } from "../resolveAction"
import { ErrorCallout } from "../toast/search-param-toast.client"
import { FormButton } from "../FormButton"
import { InputFields } from "./app-form"
import { toNativeSearchParams } from "../searchParams"
import { deepMerge } from "../deepMerge"

// Form Builder

type FormActionParam<T extends TypedForm.FormFieldMap> = TypedForm.ActionFunctionInptParam<T>
type ErrorKeys<R> = R extends string ? R : never

export function createForm<
  F extends TypedForm.FormFieldMap,
  I extends { [key: string]: any },
  R,
>(opts: {
  name: string,
  fields: F,
  action: (
    formInput: FormActionParam<F>,
    propInput: I
  ) => Promise<R>
}) {

  return (
    errorMessage: Record<ErrorKeys<R>, string>
  ) => {

    // Component
    return (props: {
      fields?: Partial<F>,
      searchParams: PageSearchParams,
      onReturn?: (
        res: R,
        formInput: FormActionParam<F>,
      ) => Promise<void>,
      defaultValues?: { [K in keyof F]?: string | number },
    } & I) => {

      const { fields, searchParams, onReturn, defaultValues, ...restInput } = props

      console.log("Prop Input", restInput)

      // Soft merge fields
      const newfields = deepMerge(opts.fields, props.fields || {}) as F

      const newAction = async (
        input: FormActionParam<F>
      ) => {
        "use server"
        const res = await opts.action(input, restInput as unknown as I)
        await props.onReturn?.(res, input)
      }

      return <Form
        className="flex flex-col gap-4"
        fields={newfields}
        action={newAction}
      >

        <InputFields
          fields={newfields}
          name={opts.name}
          classNames={{ inputBox: "small" }}
          defaultValues={defaultValues}
          searchParams={toNativeSearchParams(props.searchParams)} />

        <ErrorCallout messages={errorMessage} />

        <FormButton
          className="button primary px-6 self-end small"
          loading="Saving...">Save</FormButton>

      </Form>

    }

  }

}

// The Form.

export function Form<F extends TypedForm.FormFieldMap = {}>({ action, fields, ...props }: TypedForm.FormProps<F>) {
  return <FormWithProgressiveCustomRedirectAndClientAction
    {...props}
    action={async form => {
      "use server"
      await TypedForm.toTypedAction(fields, action)(form)
    }}
  />
}

// The subsidiaries.

function FormWithProgressiveCustomRedirectAndClientAction(props: Omit<ComponentProps<"form">, "action"> & {
  action: (form: FormData) => Promise<void>
}) {
  return <UnifiedFormWithClientRedirect
    {...props}
    action={async form => {
      "use server"
      try {
        await props.action(form)
      } catch (error) {
        const redirection = resolveCustomRedirectError(error)
        console.log("Actual Path:", redirection?.path)
        if (redirection) {
          if (redirection.mode === "replace")
            redirect(redirection.path, RedirectType.push)
          if (redirection.mode === "push")
            redirect(redirection.path, RedirectType.replace)
        }
        return console.error(error)
      }

    }}
    clientAction={props.action}
  />
}