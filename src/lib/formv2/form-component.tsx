import { InputFields } from "../basic-form/app-form"
import { FormButton } from "../FormButton"
import { actionResolveError } from "../redirects"
import { actionNavigate } from "../resolveAction"
import { toNativeSearchParams } from "../searchParams"
import { ErrorCallout } from "../toast/search-param-toast.client"
import { createProjectForm, type FormType } from "./form"
import type { ActionParameter } from "./form-action"
import { formDataToTypedInput, type FieldMap } from "./form-fields"
import { FormWithProgressiveRedirect } from "./form-redirect"


export type DefaultValues<F extends FieldMap> = Partial<Record<keyof F, any>>
export type Values<F extends FieldMap> = Partial<Record<keyof F, any>>

export function Form<F extends FormType>(props: {
  form: F,
  defaultValues?: DefaultValues<F['fields']>,
  searchParams?: PageSearchParams
  onSubmit?: (data: {
    result: F['$result'],
    inputs: ActionParameter<F['fields']>,
  }) => void,
}) {
  return <FormWithProgressiveRedirect
    className="flex flex-col gap-6"
    action={async (form) => {
      "use server"
      const inputs = formDataToTypedInput(form, props.form.fields as F['fields'])
      const response = await props.form.action(inputs) as F['$result']
      const result = actionResolveError(response, inputs)
      props.onSubmit?.({ result, inputs })
    }}
  >
    <InputFields // TODO : determine why this needs searchParams. It shouldn't. Also, move to form v2 folder
      fields={props.form.fields}
      name={""}
      classNames={{ inputBox: "small" }}
      defaultValues={props.defaultValues}
      searchParams={props.searchParams && toNativeSearchParams(props.searchParams)} />

    <ErrorCallout messages={props.form.errorMessages ?? {}} />

    <FormButton
      className="button primary px-6 self-end small"
      loading="Saving...">Save</FormButton>

  </FormWithProgressiveRedirect>
}











// Example Usage

export function CreateProjectForm() {
  return <Form
    form={createProjectForm}
    defaultValues={{ name: 'New Project' }}
    onSubmit={async ({ result, inputs }) => {
      "use server"
      actionNavigate(`/${ inputs.id }?success=created`) // todo : lift this upwards
    }}
  />
}

