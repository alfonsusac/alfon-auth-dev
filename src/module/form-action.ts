"use server"

import type { FormType } from "@/lib/formv2/form"
import { formDataToTypedInput } from "@/lib/formv2/input-fields/input-fields-util"
import { isError } from "./action/error"
import { action } from "./action/action"
import type { ResultHandler } from "./form"


export async function formAction<F extends FormType>(
  formContext: { // .binded by <Form> server component
    form: F,
    onSuccess: ResultHandler<F, void>,
  },
  formClientContext: { // .binded by <FormClientBase> client component
    context: PageContext | undefined
  },
  form: FormData // passed down to native <form action="">
) {
  const inputs = formDataToTypedInput(form, formContext.form.fields as F['fields'])
  const response = await formContext.form.action(inputs) as F['$result']
  if (isError(response)) action.error(response, formClientContext.context, inputs)
  await formContext.onSuccess({ result: response, inputs })
}

export type FormActionFirstlyBinded = (
  formClientContext: { context: PageContext | undefined },
  form: FormData
) => Promise<void>

export type FormActionSecondlyBinded = (
  form: FormData
) => Promise<void>
