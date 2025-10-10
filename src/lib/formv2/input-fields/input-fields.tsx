import { cn } from "lazy-cn"
import { InputGroup } from "./input-fields-primitives"
import type { ReactNode } from "react"



export type FieldMap = Record<string, Field>

export type Field = {
  render?: (name: string) => React.ReactNode
} & (
    | { // Inputtables
      label: string
      helper?: string,
      defaultValue?: string
      required?: boolean
      placeholder?: string
      autoFocus?: boolean
    } & (
      { // TextInput
        type: "text",
        prefix?: string,
      }
    )
    | { // Non-Inputtables
      type: "readonly",
      value: string
    }
  )


type InputFieldClassNames = {
  inputBox?: string,
  input?: string,
  label?: string,
  helper?: string,
  group?: string,
  prefix?: string,
}

export function InputField<F extends Field>(props: {
  name: string,
  field: F,
  classNames?: InputFieldClassNames,
  searchParams?: URLSearchParams
}) {
  const { name, field } = props

  if (field.render)
    return field.render(name)

  if (field.type === 'readonly')
    return <input readOnly hidden value={field.value} key={name} name={name} />

  const id = props.name + '_' + name

  const inputProps = {
    name,
    id,
    defaultValue: props.searchParams?.get(name) ?? '',
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
}



export function InputFields<M extends FieldMap>(props: {
  fields: M,
  classNames?: InputFieldClassNames,
  // defaultValues?: Partial<Record<keyof M, any>>, // Not used currently
  searchParams?: URLSearchParams
}) {
  return <>{
    Object.entries(props.fields).map(entry => {
      const [name, field] = entry
      return <InputField
        key={name}
        name={name}
        field={field}
        classNames={props.classNames}
        searchParams={props.searchParams} />
      // return <InputField key={name} name={name} field={field} />
    })
  }</>
}