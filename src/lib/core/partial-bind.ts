import type { ReactNode } from "react"

// Reference File

// = ExtractRequired<T> ==================================================
type ExtractRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}
// ==================================================================



// bind object

export function partialBindFunction<
  A extends B, B extends Record<any, any>, O
>(
  fn: (input: A) => O,
  args: B
) {
  return (input: Omit<A, keyof ExtractRequired<B>>) => {
    return fn({ ...input, ...args })
  }
}

// Test
() => {
  // samples

  const fnABC = (input: { a: string, b: number, c: boolean }) => ({ success: true })
  const a = partialBindFunction(fnABC, { a: '2' })
  const x = partialBindFunction(fnABC, { a: 'hello', b: 2 })
  x({ c: true })
  x.bind(null, { c: false }) // or this,


  const fnBC = (input: { b: number, c: boolean }) => ({ success: true })
  // @ts-expect-error a requires 'a' to be string
  const b = partialBindFunction(fnABC, { a: 4 })
  const c = partialBindFunction(fnABC, { a: 'hello', b: 2 })
  // @ts-expect-error missing a
  const d = partialBindFunction(fnBC, { a: 'asdf', b: 3 })
  const e = partialBindFunction(fnBC, { b: 3 })
  a({ b: 10, c: false })
  // @ts-expect-error missing b
  a({ c: true })

  // Wrapper Test
  function partialBindFn2Wrapper<A extends { a: string }, O>(
    fn: (input: A) => O
  ) {
    return partialBindFunction(fn, { a: 'default-a' })
  }
  
  const fn2a = partialBindFn2Wrapper(fnABC)({ b: 5, c: false })
  fn2a.success
  // @ts-expect-error d is not defined in fnABC
  partialBindFn2Wrapper(fnABC)({ b: 10, c: true, d: '' })
  // @ts-expect-error c requires boolean
  partialBindFn2Wrapper(fnABC)({ b: 10, c: 'true' })
}





// native .bind test

function test(a: string, b: string) { }
test.bind(null)
test.bind(null, 'asdf')

