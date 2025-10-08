import type { FieldMap } from "./form-fields"

export type ActionParameter<F extends FieldMap>
  = { [K in keyof F]: string }

export type Action<
  F extends FieldMap,
  R
> = (
  formInput: ActionParameter<F>,
) => Promise<R>
