import { createAction, partialBindAction, type Action, type SerializedAction } from "@/lib/core/action"
import type { Field } from "@/lib/formv2/input-fields/input-fields"

type SupportedFormInputTypes =
  | string

export type FormActionInput<T extends keyof any = string | number | symbol> = Record<T, SupportedFormInputTypes>

export type FormFields<Input extends FormActionInput = FormActionInput> =
  { [key in keyof Input]: Field }

export type AnyFormFields = FormFields<FormActionInput>

// util:
type NormalizeRecord<T> = [{}] extends T ? [] : [T]
// Make sure that when T is [{ }], it becomes empty param 
// instead of [{ }] which would allow any keys.

export type FormAction<
  I extends FormActionInput,
  O,
  F extends Partial<FormFields<I>>
> = {
  action: Action<[I], O>,
  fields: F,
}

export function form<
  I extends FormActionInput,
  O,
  F extends Partial<FormFields<I>>,
>(opts: {
  action: SerializedAction<[I], O>,
  fields: F,
}) {
  return (...params: NormalizeRecord<Omit<I, keyof F>>) => {
    const inputs = params[0] || {} as Omit<I, keyof F>
    const action = createAction({
      fn: opts.action,
      errors: opts.action.errors,
    })
    return {
      action: partialBindAction(action, inputs),
      fields: opts.fields,
    }
    // at this point keyof I == keyof F 
  }
}



// TEST ============================================================

// const Test = () => {

//   // TEST 0: wrong fields
//   const myform0 = form({
//     action: pureaction({
//       fn: async (input: { name: string, age: string }) => {
//         return { success: true }
//       },
//       errors: {},
//     }),
//     fields: {
//       // @ts-expect-error sasdf is not a valid field
//       sasdf: { type: 'text', label: 'Name' },
//     },
//   })

//   // TEST 1: partial fields provided
//   const myform = form({
//     action: pureaction({
//       fn: async (input: { name: string, age: string }) => {
//         return { success: true }
//       },
//       errors: {},
//     }),
//     fields: {
//       name: { type: 'text', label: 'Name' },
//     },
//   })

//   // @ts-expect-no-error
//   const a = myform({ age: '30' })
//   a.action.fn({ name: "asdf" })

//   // @ts-expect-error age should be provided
//   a.action.fn({ age: "adsf" })


//   // @ts-expect-error name should already be provided earlier
//   const b = myform({ age: 30, name: 'John' })



//   // TEST 2: no fields provided
//   const myform2 = form({
//     action: pureaction({
//       fn: async (input: { name: string, age: string }) => {
//         return { success: true }
//       },
//       errors: {},
//     }),
//     fields: {
//       name: { type: 'text', label: 'Name' },
//       age: { type: 'text', label: 'Age' },
//     },
//   })

//   // @ts-expect-no-error
//   const f1 = myform2()

//   // @ts-expect-error no fields should be provided
//   myform2({ asdf: "" })

//   // @ts-expect-error no fields should be provided
//   myform2({ name: "" })

//   function processForm<
//     F extends FormAction<any, any, FormFields<any>>
//   >(Props: {
//     form: FormAction<any, any, FormFields<any>>,
//   }) {

//   }

//   processForm({
//     form: f1,
//   })

// }


// export const testFormAction = form({
//   action: pureaction({
//     fn: async (input: { name: string, age: string }) => {
//       return { success: true }
//     },
//     errors: {},
//   }),
//   fields: {
//     name: { type: 'text', label: 'Name' },
//     age: { type: 'text', label: 'Age' },
//   },
// })

// export const testFormAction2 = form({
//   action: pureaction({
//     fn: async (input: { name: string, age: string }) => {
//       return { success: true }
//     },
//     errors: {},
//   }),
//   fields: {
//     name: { type: 'text', label: 'Name' },
//   },
// })