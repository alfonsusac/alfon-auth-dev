"use client"

// import { useRouter } from "next/navigation"
// import { resolveRedirectError } from "./resolveAction"
// import { type FormFieldMap } from "./AppForm"
// import { formActionHandler } from "./formHelper"
// import type { ComponentProps } from "react"

// export function Form({ action, ...props }:
//   Omit<ComponentProps<"form">, "action"> & {
//     action: (form: FormData) => Promise<void>
//   }
// ) {
//   const router = useRouter()

//   return <form {...props}
//     action={action}
//     onSubmit={async e => {
//       console.log("Form Client onSubmit")
//     }}

//   // action={
//   //   async (formData: FormData) => {
//   //     try {
//   //       await action(formData)
//   //     } catch (error) {
//   //       const redirection = resolveRedirectError(error)
//   //       if (redirection) {
//   //         if (redirection.mode === "replace")
//   //           router.replace(redirection.path, { scroll: false })
//   //         if (redirection.mode === "push")
//   //           router.push(redirection.path)
//   //       } else {
//   //         console.error(error)
//   //       }
//   //     }
//   //   }
//   // }
//   />
// }

// export namespace FormWithInput {
//   export type ActionFunction<F extends FormFieldMap> = (inputs: { [K in keyof F]: string }) => Promise<void>
// }



// export function FormWithInput<F extends FormFieldMap>({
//   action,
//   onSubmitAction,
//   fields,
//   ...props
// }: Omit<React.ComponentProps<"form">, "action">
//   & {
//     action: (form: FormData) => Promise<void>
//     onSubmitAction?: FormWithInput.ActionFunction<F>
//     fields: F
//   }
// ) {
//   return <Form
//     {...props}
//     // action={formActionHandler(fields, action)}
//     action={action}
//     onSubmit={e => {
//       e.preventDefault()
//       const formData = new FormData(e.currentTarget)
//       return formActionHandler(fields, onSubmitAction ?? (async () => { }))(formData)
//     }}
//   />
// }



