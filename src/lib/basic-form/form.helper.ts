export namespace TypedForm {
  export type FormProps<F extends FormFieldMap = {}> = Omit<React.ComponentProps<"form">, "action"> & {
    fields?: F,
    action: ActionFunction<F>,
  }
  export type FormFieldMap = Record<string, FormField>
  export type FormField = {
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

  export type ActionFunctionInptParam<F extends FormFieldMap>
    = { [K in keyof F]: string }

  export type ActionFunction<F extends FormFieldMap>
    = (inputs: ActionFunctionInptParam<F>) => Promise<void>

  export function toTypedAction<T extends FormFieldMap>(
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
}