import { DeleteAlert } from "../DeleteAlert"
import { DialogSurface } from "../dialogsv2/dialog.primitives"
import { Modal } from "../dialogsv2/modal"
import { ModalButton, ModalContent } from "../dialogsv2/modal.client"

export function DeleteDialogButton(
  props: {
    what?: string,
    name: string,
    label?: string,
    alertTitle?: string,
    alertDescription?: string,
    action: () => Promise<void>,
    context?: PageContext
  }
) {
  return <Modal
    name={"delete_" + props.name}
    context={props.context}
  >
    {dialog => <>
      <ModalButton className="button destructive small">
        {props.label ?? `Delete ${ props.what }`}
      </ModalButton>
      <ModalContent>
        <DialogSurface>
          <DeleteAlert
            title={props.alertTitle || `Are you sure you want to permanently delete ${ props.what ?? "this item" }?`}
            description={props.alertDescription || "This action cannot be undone."}
            backHref={dialog.closeHref}
            actionLabel={`Permanently Delete ${ props.what }`}
            action={props.action}
          />
        </DialogSurface>
      </ModalContent>
    </>}
  </Modal>
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