"use server"

import { action } from "@/module/action/action"

const fn = async () => {
  console.log("Test Action")
}

const withFn = (fn: () => Promise<any>) => {
  return async () => {
    await fn()
  }
}

const testFn = withFn(fn)



const fn2 = async () => {
  console.log("Test Action 2")
}

Object.assign(fn2, {
  hello: 'world',
  foo: "bar"
})

const fn3 = action({
  adminOnly: false,
  fn: () => async () => console.log("Test Action 3 from action.ts"),
  errors: {
    error1: "This is error 1",
    error2: "This is error 2",
  }
})




export { fn2, testFn, fn3 }



export async function withConsoleLog(fn: (...args: any) => Promise<any>, formData: FormData) {
  console.log("Wrapping server actions have been achieved.")
  await fn()
}

