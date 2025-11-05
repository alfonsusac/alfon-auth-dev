"use server"

import type { FormType } from "@/lib/formv2/form"
import { formDataToTypedInput } from "@/lib/formv2/input-fields/input-fields-util"
import { isError } from "./action/error"
import { action } from "./action/action"
import type { ResultHandler } from "./form"


export async function formAction<F extends FormType>(
  formContext: { // .binded by dev-land <Form> component
    form: F,
    context: PageContext | undefined
    onSuccess: ResultHandler<F, void>,
  },
  form: FormData // passed down to native <form action="">
) {
  const inputs = formDataToTypedInput(form, formContext.form.fields as F['fields'])
  const response = await formContext.form.action(inputs) as F['$result']
  if (isError(response)) action.error(response, formContext.context, inputs)
  await formContext.onSuccess({ result: response, inputs })
}
