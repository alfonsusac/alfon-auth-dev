import { DeleteAlert } from "@/lib/DeleteAlert"
import { DialogSurface } from "@/lib/dialogsv2/dialog.primitives"
import { Modal } from "@/lib/dialogsv2/modal"

export function DeleteButton(props: {
  what?: string,
  name: string,
  label?: string,
  alertTitle?: string,
  alertDescription?: string,
  action: () => Promise<void>,
  context?: PageContext
}) {
  return <>
    <Modal name={"delete_" + props.name} context={props.context}
      button={Button =>
        <Button className="button destructive small">
          {props.label ?? `Delete ${ props.what }`}
        </Button>
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
        </DialogSurface>
      }
    />
  </>
}