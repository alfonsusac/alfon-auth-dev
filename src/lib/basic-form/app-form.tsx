import type { ComponentProps, ReactNode } from "react"
import { FormButton } from "../FormButton"
import { cn } from "lazy-cn"
import { toNativeSearchParams } from "../searchParams"
import { RootForm } from "./form"
import type { TypedForm } from "./form.helper"

export function InputGroup(props: ComponentProps<"div">) {
  return <div {...props} className={cn('input-group', props.className)} />
}

export function InputFields<F extends TypedForm.FormFieldMap>(props: {
  name: string,
  fields: F,
  defaultValues?: { [K in keyof F]?: string | number },
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
        defaultValue: props.defaultValues?.[name as keyof F] ?? props.searchParams?.get(name) ?? '',
        required: field.required,
        placeholder: field.placeholder,
        type: field.type,
        autoFocus: field.autoFocus
      }

      const clsn = props.classNames ?? {}

      const innerinputjsx = field.prefix
        ?
        <div className={cn("input as-box", clsn.inputBox)}>
          <label htmlFor={id} className={cn("text-foreground-body/75", clsn.prefix)}>{field.prefix}</label>
          <input {...inputProps} className={cn("grow basis-0 min-w-0", clsn.input)} />
        </div>
        :
        <input {...inputProps} className={cn("input", clsn.input, clsn.inputBox)} />

      const inputjsx = field.type === 'text'
        ? innerinputjsx
        : null

      return <InputGroup key={name} className={clsn.group}>
        <label className={cn("label mb-1.5", clsn.label)} htmlFor={id}>
          {field.label}
          {field.helper && <p className={cn("label-helper", clsn.helper)}>{field.helper}</p>}
        </label>
        {inputjsx}
      </InputGroup>
    })
  }
  </>
}



function EditForm<F extends TypedForm.FormFieldMap>(props: {
  name: string
  action: TypedForm.ActionFunction<F>,
  fields: F
  defaultValues?: { [K in keyof F]?: string | number }
  errorCallout: ReactNode
  searchParams: Awaited<PageProps<any>['searchParams']>
}) {
  return (
    <RootForm
      className="flex flex-col gap-4"
      fields={props.fields}
      action={props.action}>

      <InputFields
        fields={props.fields}
        defaultValues={props.defaultValues}
        name={props.name}
        classNames={{ inputBox: "small" }}
        searchParams={toNativeSearchParams(props.searchParams)} />

      {props.errorCallout}

      <FormButton
        className="button primary px-6 self-end small"
        loading="Saving...">Save</FormButton>

    </RootForm>
  )
}

function CreateForm<F extends TypedForm.FormFieldMap>(props: {
  name: string
  action: TypedForm.ActionFunction<F>,
  fields: F
  defaultValues?: { [K in keyof F]?: string | number }
  errorCallout: ReactNode
  searchParams: Awaited<PageProps<any>['params']>
}) {
  return (
    <RootForm
      className="flex flex-col gap-6"
      fields={props.fields}
      action={props.action}>

      <InputFields
        fields={props.fields}
        defaultValues={props.defaultValues}
        name={props.name}
        searchParams={toNativeSearchParams(props.searchParams)} />

      {props.errorCallout}

      <FormButton
        className="button primary px-6 mt-4 w-30"
        loading="Creating...">Create</FormButton>

    </RootForm>
  )
}







export const form = {
  EditForm,
  CreateForm
}
