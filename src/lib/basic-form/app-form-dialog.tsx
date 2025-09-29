import { Dialog, DialogTitle } from "../dialogs/dialog"
import { form } from "./app-form"
import type { TypedForm } from "./form.helper"

export function EditFormDialog<F extends TypedForm.FormFieldMap>(
  props: {
    id: string,
    name: string,
    fields: F,
    searchParams: PageSearchParams,
    errorCallout?: React.ReactNode,
    action: (
      inputs: TypedForm.ActionFunctionInptParam<F>,
      dialogContext: PageContext
    ) => Promise<void>,
    context?: PageContext,
  }
) {
  return (
    <Dialog name={`edit_${ props.id }`} context={props.context}>
      {(EditButton, EditDialog, dialogContext) => <>
        <EditButton className="button small -mt-8">
          Edit {props.name} Details
        </EditButton>

        <EditDialog wide>
          <DialogTitle>Edit {props.name}</DialogTitle>
          <form.EditForm
            name={`edit_${ props.name }_${ props.id }`}
            fields={props.fields}
            searchParams={props.searchParams}
            errorCallout={props.errorCallout}
            action={async (inputs) => {
              "use server"
              await props.action(inputs, dialogContext)
            }}
          />
        </EditDialog>
      </>}
    </Dialog>
  )
}