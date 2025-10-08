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

export function formDataToTypedInput<T extends FieldMap>(form: FormData, fields: T) {
  const inputs: { [K in keyof T]: string } = {} as any
  for (const key in fields) {
    const value = form.get(key)
    if (typeof value === 'string') {
      inputs[key] = value
    } else {
      throw new Error(`Invalid value for field ${ key }`)
    }
  }
  return inputs
}


export function toTypedAction<T extends FieldMap>(
  fields: T | undefined,
  action: (inputs: { [K in keyof T]: string }) => Promise<void>
) {
  return (form: FormData) => {
    const inputs: { [K in keyof T]: string } = {} as any
    for (const key in fields) {
      const value = form.get(key)
      if (typeof value === 'string') {
        inputs[key] = value
      } else {
        throw new Error(`Invalid value for field ${ key }`)
      }
    }
    return action(inputs)
  }
}