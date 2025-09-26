export async function to<T>(promise: Promise<T>) {
  try {
    const result = await promise
    return [null, result] as const
  } catch (err) {
    return [err as Error, null] as const
  }
}