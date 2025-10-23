import type { Action } from "./form-action"
import type { ErrorMessages } from "./form-action-results"
import type { ExtractErrorMessageMapFromRes } from "../toast/search-param-toast.clients"
import type { FieldMap } from "./input-fields/input-fields"


// Form definition type

export type FormType<
  F extends FieldMap = any,
  R = any,
> = {
  fields: F,
  action: Action<F, R>,
  errorMessages: ErrorMessages<R>,
  $result: R,
}




// Factory function to create a form definition

export const createForm = <
  I extends FieldMap,
  R,
>(opts: { // Logic layer
  fields: I,
  action: Action<I, R>,
}) => (
  opts2: { // Still logic, just slightly improve DX for errorMessage auto completion.
    errorMessages?: ExtractErrorMessageMapFromRes<Action<I, R>>
  }
) => {
    return {
      fields: opts.fields,
      action: opts.action,
      errorMessages: opts2.errorMessages ?? {},
      $result: undefined as unknown as R,
    }
  }
