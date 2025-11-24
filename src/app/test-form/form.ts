import { form } from "@/module/action/form-action"
import { fn3 } from "./action"

// setTimeout(() => {
//   console.log("Test", fn3.toString(), "while", fn3.toString())
// }, 500)

const fn6 = form({
  action: fn3,
  fields: {}
})

export { fn6 }