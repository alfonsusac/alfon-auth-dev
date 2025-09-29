import { DeleteAlert2 } from "../DeleteAlert"
import { Dialog } from "./dialog"

export function DeleteDialogButton(
  props: {
    name: string,
    label: string,
    alertTitle?: string,
    alertDescription?: string,
    alertActionLabel?: string,
    action: () => Promise<void>,
    context2?: { [key: string]: string }
  }
) {
  return <Dialog name={`delete_${ props.name }`} context={props.context2}>
    {dialog => <>
      <dialog.Button className="button destructive small">
        {props.label}
      </dialog.Button>
      <dialog.Content>
        <DeleteAlert2
          title={props.alertTitle || `Are you sure you want to permanently delete this item?`}
          description={props.alertDescription || "This action cannot be undone."}
          backHref={'?'}
          actionLabel="Delete"
          action={props.action}
        />
      </dialog.Content>
    </>}
  </Dialog>
}



















// Server Component version (with Link)

// export function DeleteDialogButton(props: {
//   label: string,
//   searchParams: Awaited<PageProps<any>['searchParams']>,
//   alertTitle?: string,
//   alertDescription?: string,
//   alertActionLabel?: string,
//   action: () => Promise<void>,
// }) {
//   const sp = props.searchParams

//   return <>
//     <Link className="button destructive small"
//       href={`?delete=show`} scroll={false}>
//       {props.label}
//     </Link>

//     {sp.delete === 'show' && <div className="fixed top-0 left-0 w-screen h-screen">
//       <DialogBackdropLink/>
//       <DialogPaper className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-80">
//         <DeleteAlert2
//           title={props.alertTitle || `Are you sure you want to permanently delete this item?`}
//           description={props.alertDescription || "This action cannot be undone."}
//           backHref={'?'}
//           actionLabel="Delete"
//           action={props.action}
//         />
//       </DialogPaper>
//     </div>}

//   </>
// }