export function isError<T>(e: T): e is Extract<T, string> {
  return typeof e === 'string'
}