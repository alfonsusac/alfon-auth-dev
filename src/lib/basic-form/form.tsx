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
import { actionResolveError } from "../redirects"



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
      onSuccess?: (
        res: R,
        formInput: FormActionParam<F>,
      ) => Promise<void>,
      defaultValues?: { [K in keyof F]?: string | number },
    } & I) => {

      const { fields, searchParams, onSuccess, defaultValues, ...restInput } = props

      // Soft merge fields
      const newfields = deepMerge(opts.fields, props.fields || {}) as F

      const newAction = async (
        input: FormActionParam<F>
      ) => {
        "use server"
        const res = await opts.action(input, restInput as unknown as I)
        await props.onSuccess?.(res, input)
        // actionResolveError(res, { ...input, ...props.context })
        // if (props.revalidatePath) revalidatePath(props.revalidatePath, props.revalidatePathMode)
        // actionNavigate(await props.onSuccess?.(res, input) ?? '', props.redirectMode ?? "replace", props.context)
        return void 0
      }

      return <RootForm
        className="flex flex-col gap-4"
        fields={newfields}
        action={async (...props) => {
          "use server"
          return await newAction(...props)
        }}
      >

        <InputFields
          fields={newfields}
          name={opts.name}
          classNames={{ inputBox: "small" }}
          defaultValues={defaultValues}
          searchParams={props.searchParams && toNativeSearchParams(props.searchParams)} />

        <ErrorCallout messages={errorMessage} />

        <FormButton
          className="button primary px-6 self-end small"
          loading="Saving...">Save</FormButton>

      </RootForm>

    }

  }

}

// The Form.

export function Form<
  F extends TypedForm.FormFieldMap,
  R,
  P
>(props: {
  name: string,
  fields: F,
  context: PageContext,
  action: (
    formInput: FormActionParam<F>,
  ) => Promise<R>,
  defaultValues?: { [K in keyof F]?: string | number },
  errors?: Record<ErrorKeys<R>, string>,
  searchParams?: PageSearchParams,
}) {

  const { fields, searchParams, defaultValues, ...restInput } = props


  const newAction = async (
    input: FormActionParam<F>
  ) => {
    "use server"
    const res = await props.action(input)
    actionResolveError(res, input, props.context)

    // await props.onSuccess?.(res, input)
    // actionResolveError(res, { ...input, ...props.context })
    // if (props.revalidatePath) revalidatePath(props.revalidatePath, props.revalidatePathMode)
    // actionNavigate(await props.onSuccess?.(res, input) ?? '', props.redirectMode ?? "replace", props.context)
    return void 0
  }

  return <RootForm
    className="flex flex-col gap-4"
    fields={fields}
    action={newAction}
  >

    <InputFields
      fields={fields}
      name={props.name}
      classNames={{ inputBox: "small" }}
      defaultValues={defaultValues}
      searchParams={props.searchParams && toNativeSearchParams(props.searchParams)} />

    <ErrorCallout messages={props.errors ?? {}} />

    <FormButton
      className="button primary px-6 self-end small"
      loading="Saving...">Save</FormButton>

  </RootForm>

}



// The Form. (Root)

export function RootForm<F extends TypedForm.FormFieldMap = {}>({ action, fields, ...props }: TypedForm.FormProps<F>) {
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