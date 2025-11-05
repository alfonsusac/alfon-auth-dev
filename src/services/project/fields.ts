import type { PseudoClass } from "@/lib/core/pseudo-class"


function field<const E, T = string, const V extends ((value?: string) => { val: T } | E) = (value?: string) => { val: T }>(opts: {
  type?: "text"
  validations?: V
}) {




  return {
    type: opts.type || "text",
    validate: (opts.validations || (value => value)) as V
  }
}

type ProjectID = PseudoClass<string, 'ProjectID'>

export const projectIdField = field({
  type: "text",
  validations: value => {
    if (!value || value.length === 0) return "missing_fields"
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) return "invalid_id"
    return { val: value as ProjectID }
  },
})



function error<const T>(error: T) {
  return { ok: false as const, error: "an_error_occurred" }
}
function success<const T>(val: T) {
  return { ok: true as const, val }
}

function test(a: string) {
  if (a) return error("an_error_occurred")
  return success(123)
}

const v = test("asdasd")
if (!v.ok) {
  v.error
} else {
  v.val
}


type DiscriminatedResultFunction<V, E extends string> = (input: any) => { val: V } | E

function fn<const V, const E extends string>(fn: DiscriminatedResultFunction<V, E>) {
  return fn as DiscriminatedResultFunction<V, E>
}

const fn1 = fn((input: string) => {
  if (input === '1') return "asdasdfasdff"
  return { val: 1 }
})

// const e = fn1('1')
// if (e.error) {
//   e.error
// } else {
//   e.val
// }




// export const projectFields = {
//   id: {
//     type: "text", required: true,
//     label: "project id",
//     helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
//     prefix: "https://auth.alfon.dev/",
//     placeholder: "project_id",
//   },
//   name: {
//     type: "text", required: true,
//     label: "project name",
//     helper: "give your project a name or identification",
//     placeholder: "My Project",
//     defaultValue: "New Project",
//   },
//   description: {
//     type: "text",
//     label: "description",
//     helper: "describe your project for future reference (optional)",
//     placeholder: "This is my project",
//   },
// } satisfies FieldMap 

// type T = Prisma.Project