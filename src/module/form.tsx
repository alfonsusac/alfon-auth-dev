// import { type ComponentProps } from "react"
// import { FormButton } from "../lib/FormButton"
// import { toNativeSearchParams } from "../lib/next/next-search-params"
// import { ErrorCallout } from "../lib/next/next-search-param-toast.client"
// import { FormWithProgressiveRedirect } from "../lib/formv2/form-redirect"
// import { cn } from "lazy-cn"
// import { InputFields, type Fields, type PartialFields } from "../lib/formv2/input-fields/input-fields"
// import { searchParams } from "@/lib/next/next-page"
// import { ActionError, resolveAction } from "./action/action"
// import { formDataToTypedInput } from "@/lib/formv2/input-fields/input-fields-util"

// Just Server Buttons

// export function ActionButton(props: ComponentProps<typeof FormButton> & {
//   action: () => Promise<void>,
//   loading: string,
// }) {
//   const { action, loading, ...rest } = props
//   return <FormWithProgressiveRedirect action={action} className={props.className}>
//     <FormButton {...rest}
//       className={cn("button", props.className)}
//       loading={props.loading} />
//   </FormWithProgressiveRedirect>
// }



// Complete Form Package

// This is going to be hard to debug.

// const act = action({
//   fn: async context => async (input: { a: string, b: string }) => 2,
//   adminOnly: false,
//   errors: {}
// })
// const act2 = action({
//   fn: async context => async (input: string) => true,
//   adminOnly: false,
//   errors: {}
// })

// type Z = FormActionFields<FormAction<Parameters<typeof act['fn']>[0]>>
// type Z2 = FormActionFields<FormAction<Parameters<typeof act2['fn']>[0]>>
// type Z1 = FormActionFields<FormAction<any>>
// type Z3 = FormActionFields



// // Defining [FormType<>]

// export type FormAction<I> = I extends Record<string, string> ? Action<[I], any> : never   // only allow actions with single parameter

// type FormActionInputs<A extends FormAction<any> = FormAction<any>> = A extends FormAction<infer I> ? I : never
// type FormActionFields<A extends FormAction<any> = FormAction<any>> = Fields<keyof FormActionInputs<A>>

// export type FormType<
//   A extends FormAction<any> = FormAction<any>,
//   F extends FormActionFields = FormActionFields, // Deduce necessary fields from action input
// > = {
//   action: A,
//   fields: F,
// }


// // Defining [form()]

// type EnforceFormActionProp<A extends Action<any, any>> =
//   A extends Action<infer X, any> ? X extends [Record<string, string>] ? A : never : never

// export const form = <
//   A extends Action<any, any>,
//   F extends FormActionFields<A>,
// >(opts: {
//   action: EnforceFormActionProp<A>,
//   fields: F,
// }) => {
//   return {
//     fields: opts.fields,
//     action: opts.action,
//   }
// }



// Defining [<Form>]

// type FormActionExtendFields<F extends FormType> = PartialFields<F['fields']>

// type FormResultValues<F extends FormType> = ActionReturnType<F['action']>
// type FormResultInputs<F extends FormType> = {
//   [key in keyof F['fields']]: string
// }


// type FormReadOnlyValues<F extends FormType> = {
//   [key in keyof F['fields']as F['fields'][key]['type'] extends 'readonly' ? key : never]: string
// }
// export type FormReadOnlyValuesProp<F extends FormType = any> = F['fields'] extends Record<string, infer V> ? [V & { type: "readonly" }] extends [never]
//   ? { values?: { [key in keyof F['fields']]?: string } }
//   : { values: { [key in keyof F['fields']as F['fields'][key]['type'] extends 'readonly' ? key : never]: string } }
//   : { values?: { [key in keyof F['fields']]?: string } }

// export type FormProps<F extends FormType<any, any>> =
//   {
//     form: F,
//     extends?: FormActionExtendFields<F>,
//     onSuccess: (data: {
//       result: FormResultValues<F>,
//       inputs: FormResultInputs<F>,
//     }) => Promise<void>,
//   } & FormReadOnlyValuesProp<F>


// export async function Form<
//   F extends FormType,
// >(
//   props: FormProps<F>
// ) {
//   const sp = await searchParams()

//   // Merge extended values into form fields
//   if (props.extends) {
//     for (const k in props.form.fields) {
//       if (k in props.extends) {
//         const key = k
//         props.form.fields[key] = {
//           ...props.form.fields[key],
//           ...props.extends[key],
//         }
//       }
//       if ('values' in props && props.values && k in props.values) {
//         const key = k as F['fields'][string]['type'] extends 'readonly' ? string : never
//         props.form.fields[key] = {
//           ...props.form.fields[key],
//           type: 'readonly',
//           value: props.values[key],
//         }
//       }
//     }
//   }


//   // Form action handler, declare what happen on error or success
//   const domAction: FormActionFirstlyBinded = async (formClientContext, form) => {
//     "use server"
//     const inputs = formDataToTypedInput(form, props.form.fields as F['fields'])
//     try {
//       const response = await props.form.action.fn(inputs)
//       await props.onSuccess({ result: response, inputs })
//     } catch (error) {
//       if (error instanceof ActionError) {
//         resolveAction.error(error.message, formClientContext.context, inputs)
//         return
//       }
//       if (error instanceof Error && error.message === "NEXT_REDIRECT") {
//         throw error
//       }
//       console.error("uncaught error in form action:", error, ":---: please re-throw with ActionError")
//     }
//   }

//   return <FormWithProgressiveRedirect
//     className="flex flex-col gap-6 aspect-"
//     action={domAction}
//   >
//     <InputFields
//       fields={props.form.fields}
//       classNames={{ inputBox: "small" }}
//       searchParams={toNativeSearchParams(sp)} />

//     <ErrorCallout messages={props.form.action.errorMap ?? {}} />

//     <FormButton
//       className="button primary px-6 self-end small"
//       loading="Saving...">Save</FormButton>

//   </FormWithProgressiveRedirect>

// }










export type FormActionFirstlyBinded = (
  formClientContext: { context: PageContext | undefined },
  form: FormData
) => Promise<void>

export type FormActionSecondlyBinded = (
  form: FormData
) => Promise<void>
