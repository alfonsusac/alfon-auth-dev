import type { FieldMap } from "@/lib/formv2/input-fields/input-fields"

type OmitKeyIfReadonly<F extends FieldMap, Key extends keyof F> =
  F[Key]['type'] extends 'readonly' ? never : Key

type FieldMapToInput<F extends FieldMap> = {
  [key in keyof F as OmitKeyIfReadonly<F, key>]: string
}



export type NextForm<F extends FieldMap> = {
  fields: F,
  action: (input: FieldMapToInput<F>) => Promise<any>,
}

export function createForm<F extends FieldMap>(opts: {
  fields: F,
  action: (input: FieldMapToInput<F>) => Promise<any>,
}) {
  return opts as NextForm<F>
}

