import type { ComponentProps, ReactNode } from "react"
import { FormWithInput } from "./Form"
import { FormButton } from "./FormButton"
import { cn } from "lazy-cn"
import { toNativeSearchParams } from "./searchParams"
import { formActionHandler } from "./formHelper"
import { Form } from "./basic-form/Form"
import type { TypedForm } from "./basic-form/form.helper"

export function InputGroup(props: ComponentProps<"div">) {
  return <div {...props} className={cn('input-group', props.className)} />
}

export type FormFieldMap = Record<string, FormField>

type FormField = {
  render?: (name: string) => React.ReactNode
} & (
    | {
      label: string
      helper?: string
      defaultValue?: string
      required?: boolean
      placeholder?: string
    } & (
      {
        type: "text",
        prefix?: string
      }
    )
    | {
      type: "readonly",
      value: string
    }
  )

function InputFields<F extends FormFieldMap>(props: {
  name: string,
  fields: F,
  classNames?: {
    inputBox?: string,
    input?: string,
    label?: string,
    helper?: string,
    group?: string,
    prefix?: string,
  }
  searchParams?: URLSearchParams
}) {
  return <>{
    Object.entries(props.fields).map(entry => {
      const [name, field] = entry

      if (field.render)
        return field.render(name)

      if (field.type === 'readonly')
        return <input readOnly hidden value={field.value} key={name} name={name} />

      const id = props.name + '_' + name

      const inputProps = {
        name,
        id,
        defaultValue: field.defaultValue ?? props.searchParams?.get(name) ?? '',
        required: field.required,
        placeholder: field.placeholder,
        type: field.type,
      }

      const clsn = props.classNames ?? {}

      const innerinputjsx = field.prefix
        ?
        <div className={cn("input small as-box", clsn.inputBox)}>
          <label htmlFor={id} className={cn("text-foreground-body/75", clsn.prefix)}>{field.prefix}</label>
          <input {...inputProps} className={cn("grow", clsn.input)} />
        </div>
        :
        <input {...inputProps} className={cn("input", clsn.input, clsn.inputBox)} />

      const inputjsx = field.type === 'text'
        ? innerinputjsx
        : null

      return <InputGroup key={name} className={clsn.group}>
        <label className={cn("label", clsn.label)} htmlFor={id}>
          {field.label}
          {field.helper && <p className={cn("label-helper", clsn.helper)}>{field.helper}</p>}
        </label>
        {inputjsx}
      </InputGroup>
    })
  }
  </>
}


function EditForm<F extends FormFieldMap>(props: ComponentProps<typeof InputFields> & {
  name: string
  action: FormWithInput.ActionFunction<F>,
  fields: F
  errorCallout?: ReactNode
  searchParams?: Awaited<PageProps<any>['params']>
}) {
  return (
    <Form
      className="flex flex-col gap-4"
      fields={props.fields}
      action={props.action}>

      <InputFields
        fields={props.fields}
        name={props.name}
        classNames={{ inputBox: "small" }}
        searchParams={toNativeSearchParams(props.searchParams)} />

      {props.errorCallout}

      <FormButton
        className="button primary px-6 self-end small"
        loading="Saving...">Save</FormButton>

    </Form>
  )
}


// function CreateForm<F extends FormFieldMap>(props: {
//   name: string
//   action: (form: FormData) => Promise<void>,
//   // action: FormWithInput.ActionFunction<F>,
//   fields: F
//   errorCallout: ReactNode
//   searchParams?: Awaited<PageProps<any>['params']>
// }) {
//   return (
//     <FormWithInput
//       className="flex flex-col gap-6 max-w-80"
//       fields={props.fields}
//       // action={async (form) => {
//       //   "use server"
//       //   console.log("Action Prop Called")
//       //   return await props.action(form)
//       //   // return await formActionHandler(props.fields, props.action)(form)
//       //   // try {
//       //   //   return await formActionHandler(props.fields, props.action)(form)
//       //   // } catch (error) {
//       //   //   console.log("error", error)
//       //   // }
//       // }}
//       action={props.action}
//     // onSubmitAction={async () => {}}
//     // onSubmitAction={props.action}
//     >

//       <InputFields
//         fields={props.fields}
//         name={props.name}
//         searchParams={toNativeSearchParams(props.searchParams)}
//       />

//       {props.errorCallout}

//       <FormButton
//         className="button primary px-6 mt-4 w-30"
//         loading="Creating...">Create</FormButton>

//     </FormWithInput>
//   )
// }

function CreateForm<F extends FormFieldMap>(props: {
  name: string
  action: TypedForm.ActionFunction<F>,
  fields: F
  errorCallout: ReactNode
  searchParams?: Awaited<PageProps<any>['params']>
}) {
  return (
    <Form
      className="flex flex-col gap-6 max-w-80"
      fields={props.fields}
      action={props.action}>
      
      <InputFields
        fields={props.fields}
        name={props.name}
        searchParams={toNativeSearchParams(props.searchParams)} />

      {props.errorCallout}

      <FormButton
        className="button primary px-6 mt-4 w-30"
        loading="Creating...">Create</FormButton>
      
    </Form>
  )
}







export const form = {
  EditForm,
  CreateForm
}
