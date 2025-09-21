export function resolveValidation<const T>(result: T) {
  if (typeof result === 'string') {
    return { error: result as T extends infer U ? U extends string ? U : never : never } as const
  }
  return { data: result as T extends infer U ? U extends string ? never : U : never } as const
}

export function validation<A extends any[], B>(cb: (...args: A) => Promise<B>) {
  return async (...args: A) => {
    return resolveValidation(await cb(...args))
  }
}