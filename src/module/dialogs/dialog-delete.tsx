import type { Action, ActionFn, SerializedAction } from "@/lib/core/action"
import { DeleteAlert } from "@/lib/DeleteAlert"
import { DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { ErrorCallout } from "@/lib/next/next-search-param-toast.client"

export function DeleteButton(props: {
  what?: string,
  name: string,
  label?: string,
  alertTitle?: string,
  alertDescription?: string,
  context?: PageContext
  action: SerializedAction<[], any>,
}) {
  return <>
    <Modal name={"delete_" + props.name} context={props.context}
      button={
        <Modal.Trigger className="button destructive small">
          {props.label ?? `Delete ${ props.what }`}
        </Modal.Trigger>
      }
      content={dialog =>
        <DialogSurface>
          <DeleteAlert
            title={props.alertTitle || `Are you sure you want to permanently delete ${ props.what ?? "this item" }?`}
            description={props.alertDescription || "This action cannot be undone."}
            backHref={dialog.closeHref}
            actionLabel={`Permanently Delete ${ props.what }`}
            action={props.action}
          />
          <ErrorCallout
            messages={props.action.errors}
          />
        </DialogSurface>
      }
    />
  </>
}