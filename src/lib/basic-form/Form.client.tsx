// "use client"

// import { useRouter } from "next/navigation"
// import { startTransition, type ComponentProps } from "react"
// import { resolveCustomRedirectError } from "../resolveAction"

// export function UnifiedFormWithClientRedirect(props: ComponentProps<"form"> & {
//   clientAction?: (form: FormData) => Promise<void>
// }) {
//   const router = useRouter()

//   const {
//     clientAction,               // to be passed to action={}, cannot be modified.
//     action: progressiveAction,  // to be passed to onSubmit={}, converted and wrapped with custom redirect handler.
//     ...rest
//   } = props

//   return <form
//     {...rest}
//     action={progressiveAction}
//     onSubmit={async e => {
//       e.preventDefault()
//       startTransition(async () => {
//         try {
//           if (!clientAction) return
//           const formData = new FormData(e.target as HTMLFormElement)
//           await clientAction(formData)
//         } catch (error) {
//           const redirection = resolveCustomRedirectError(error)
//           if (redirection) {
//             if (redirection.mode === "replace")
//               return router.replace(redirection.path, { scroll: false })
//             if (redirection.mode === "push")
//               return router.push(redirection.path)
//           }
//           return console.error(error)
//         }
//       })
//     }}
//   />
// }
