import type { action } from "@/module/action/action"
import type { FieldMap } from "./input-fields/input-fields"

export type ActionParameter<F extends FieldMap>
  = { [K in keyof F]: string }

export type Action<
  F extends FieldMap,
  R
> = (
  ctx: ActionParameter<F>
) => Promise<R>
