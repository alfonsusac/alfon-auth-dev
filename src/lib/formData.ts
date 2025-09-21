export function getStringInputs<const T extends string[]>(form: FormData, fields: T) {
  const inputs: { [key: string]: string | undefined } = {}
  for (const field of fields) {
    const value = form.get(field)
    if (typeof value === "string") {
      inputs[field] = value ?? ""
    } else if (value instanceof File) {
      // Skip file inputs
      continue
    } else {
      inputs[field] = undefined
    }
  }
  // return inputs as { [K in T[number]]: string }
  return inputs as { [K in T[number]]: string }
}