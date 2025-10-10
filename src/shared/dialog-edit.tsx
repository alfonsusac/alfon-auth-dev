// import { MaterialSymbolsEdit } from "@/lib/basic-form/app-form-dialog"
// import { DialogTitle } from "@/lib/dialogs/dialog"
import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal, type ModalServerContext } from "@/lib/dialogsv2/modal"
import { IconEdit } from "./icons"

export function EditFormDialog(props: {
  name: string,
  context?: PageContext,
  children?: (dialog: ModalServerContext) => React.ReactNode,
}) {
  return <>
    <Modal
      name={"edit_" + props.name}
      context={props.context}
      button={Button =>
        <Button className={"button small"}>
          <IconEdit className="mt-0.5 mr-1" /> Edit Details
        </Button>
      }
      content={dialog =>
        <DialogSurface wide>
          <DialogTitle>Edit {props.name}</DialogTitle>
          {props.children?.(dialog)}
        </DialogSurface>
      }
    />
  </>
}