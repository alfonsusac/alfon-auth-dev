import { FormWithProgressiveRedirect } from "@/lib/formv2/form-redirect"
import { fn2, testFn, withConsoleLog } from "./action"
import { type FormFields, type FormActionInput, type FormAction, form } from "@/module/action/form-action"
import { action } from "@/module/action/action"
import { fn6 } from "./form"

export default async function TestFormPage() {
  return <>
    <form action={async () => {
      "use server"
      console.log("Hello World")
    }}>
      <button>Submit</button>
    </form>
    <form
      action={testFn}
    >
      <button>Test</button>
    </form>
    <FormWithProgressiveRedirect
      action={fn2}
    >
      <button>Test2</button>
    </FormWithProgressiveRedirect>
    <Form
      form={fn6({})}
    />
  </>
}

const testAction = action({
  adminOnly: false,
  fn: () => async () => {
    "use server"
    console.log("Test Action")
  },
  errors: {}
})

// const testForm = form({
//   action: testAction,
//   fields: {},
// })


function Form<
  O,
  F extends FormFields<FormActionInput>,
>(Props: {
  action?: () => Promise<void>,
  form: FormAction<FormActionInput<keyof F>, O, F>,
}) {

  const fn = Props.form.action.fn

  const action = async function withConsoleLog(formData: FormData) {
    "use server"
    console.log("Wrapping server actions have been achieved.")
    await fn({} as any)
  }

  return <form action={action}>
    <button type="submit">Submit Form</button>
  </form>

}