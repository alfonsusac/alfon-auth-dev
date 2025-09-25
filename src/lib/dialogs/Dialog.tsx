
import { type ComponentProps } from "react"
import { cn } from "lazy-cn"
import { DialogBackdropLink, DialogBase } from "./Dialog.client"
import { Link } from "../link/Link"

export function DialogButton(props: {
  name: string,
  label: React.ReactNode,
  children?: React.ReactNode,
}) {
  return (
    <DialogBase {...props} />
  )
}

// export function DialogButton(props: {
//   name: string,
//   label: React.ReactNode,
//   children?: React.ReactNode,
//   searchParams: Awaited<PageProps<any>['searchParams']>,
// }) {
//   const sp = props.searchParams

//   const show = sp[props.name] === 'show'

//   return <>
//     <Link
//       className="button destructive small"
//       href={`?${ props.name }=show`}
//       scroll={false}
//     >
//       {props.label}
//     </Link>

//     <div className={cn(
//       show ? "opacity-100" : "opacity-0 pointer-events-none",
//       "fixed top-0 left-0 w-screen h-screen z-(--z-dialog)"
//     )}>
//       <DialogBackdropLink />
//       {props.children}
//     </div>
//   </>
// }

export function DialogPaper(props: ComponentProps<"div">) {
  return <div {...props} className={cn("absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-80", props.className)} />
}
