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

export namespace FormUtil {
  // --- Error handling for redirection in both server and client components ---

  export function resolveCustomRedirectError(
    error: any
  ) {
    if (
      error instanceof Error
      && error.message === "NEXT_REDIRECT"
    ) {
      const digest = (error as any).digest as string
      // NEXT_REDIRECT;replace;/project2/key/e9d859c8-3816-40d5-8729-421dd7d268fa?error=callbackURI_must_match_domain;307;
      const [_, mode, path, __] = digest.split(";")
      const actualPath = path.startsWith('/___resolve___') ? path.slice(14) : path
      if (mode === "replace")
        return { path: actualPath, mode: "replace" as const }
      else
        return { path: actualPath, mode: "push" as const }
    } else {
      return null
    }
  }
  export function withCustomRedirect(

  ) {

  }
}




