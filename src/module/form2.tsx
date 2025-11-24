import { InputFields, type PartialFields } from "@/lib/formv2/input-fields/input-fields"
import { searchParams } from "@/lib/next/next-page"
import { formDataToTypedInput, type FormTypedInput } from "@/lib/formv2/input-fields/input-fields-util"
import type { AnyFormFields, FormAction, FormActionInput, FormFields } from "./action/form-action"
import { FormWithProgressiveRedirect } from "@/lib/formv2/form-redirect"
import type { FormActionFirstlyBinded } from "./form"
import { ActionError, resolveAction } from "./action/action"
import { toNativeSearchParams } from "@/lib/next/next-search-params"
import { FormButton } from "@/lib/FormButton"
import { ErrorCallout } from "@/lib/next/next-search-param-toast.client"

// extend prop util for forms
type FormActionExtendFields<F extends AnyFormFields>
  = PartialFields<{ [key in keyof F]: NonNullable<F[key]> }>

function mergeExtendWithFields<F extends AnyFormFields,>(
  fields: F,
  extendsFields?: FormActionExtendFields<F>,
) {
  if (!extendsFields) return
  for (const k in fields) {
    if (k in extendsFields === false) continue
    fields[k] = {
      ...fields[k],
      ...extendsFields[k],
    }
  }
}



// onSuccess prop util for forms
type FormOnSuccess<F extends AnyFormFields, O>
  = (data: { result: O, inputs: FormTypedInput<F> }) => Promise<void>

export type FormProps<
  O,
  F extends FormFields,
> = Parameters<typeof Form<O, F>>[0]

// Defining <Form>
export async function Form<
  O,
  F extends FormFields<FormActionInput>,
>(Props: {
  form: FormAction<FormActionInput<keyof F>, O, F>, // i have no idea how this [keyof F] works
  extend?: FormActionExtendFields<F>
  onSuccess?: FormOnSuccess<F, O>
}) {
  const sp = await searchParams()

  // Merge values from `extends` prop into form fields
  mergeExtendWithFields(Props.form.fields, Props.extend)

  const fn = Props.form.action.fn

  const action: FormActionFirstlyBinded = async (formClientContext, form) => {
    "use server"
    const inputs = formDataToTypedInput(form, Props.form.fields)
    try {
      const response = await fn(inputs)
      await Props.onSuccess?.({ result: response, inputs })
    } catch (error) {
      if (error instanceof ActionError) {
        resolveAction.error(error.message, formClientContext.context, inputs)
        return
      }
      if (error instanceof Error && error.message === "NEXT_REDIRECT")
        throw error
      console.error("uncaught error in form action:", error, ":---: please re-throw with ActionError")
    }
  }

  return (
    <FormWithProgressiveRedirect
      className="flex flex-col gap-6"
      action={action}
    >
      <InputFields
        fields={Props.form.fields}
        classNames={{ inputBox: 'small' }}
        searchParams={toNativeSearchParams(sp)} />

      <ErrorCallout messages={Props.form.action.errors} />

      <FormButton
        className="button primary px-6 self-end small"
        loading="Saving...">
        Save
      </FormButton>

    </FormWithProgressiveRedirect>
  )
}




// Type Tests

// const test = () => {
//   <>
//     <Form
//       // using manual written FormAction
//       form={{
//         // @ts-expect-error: fields prop determines what inputs are required. therefore action input must match fields.
//         action: testFormAction().action,
//         fields: {
//           name: { type: 'text', label: 'Name' },
//         },
//       }}
//     />
//     <Form
//       // using Form with testFormAction
//       form={testFormAction()}
//       onSuccess={async () => {
//         /* empty */
//       }}
//     />
//     <Form
//       // using Form with testFormAction2
//       form={testFormAction2({ age: '30' })}
//       onSuccess={async () => {
//         /* empty */
//       }}
//     />
//   </>
// }