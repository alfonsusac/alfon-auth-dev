type PlainObject = { [key: string]: any }

export function deepMerge<T extends PlainObject, U extends PlainObject>(base: T, override: U): T & U {
  const result: any = { ...base }

  for (const key in override) {
    if (
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key]) &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(base[key], override[key])
    } else {
      result[key] = override[key]
    }
  }

  return result
}