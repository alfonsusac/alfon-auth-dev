export function formActionHandler<T extends { [name: string]: any }>(
  fields: T,
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