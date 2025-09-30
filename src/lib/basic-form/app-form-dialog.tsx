import type { SVGProps } from "react"
import { Dialog, DialogTitle } from "../dialogs/dialog"
import { form } from "./app-form"
import type { TypedForm } from "./form.helper"
import { cn } from "lazy-cn"

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
    btnClassName?: string,
  }
) {
  return (
    <Dialog name={`edit_${ props.id }`} context={props.context}>
      {dialog => <>
        <dialog.Button className={cn("button small", props.btnClassName)}>
          <MaterialSymbolsEdit className="mt-0.5 mr-1" /> Edit Details
        </dialog.Button>

        <dialog.Content wide>
          <DialogTitle>Edit {props.name}</DialogTitle>
          <form.EditForm
            name={`edit_${ props.name }_${ props.id }`}
            fields={props.fields}
            searchParams={props.searchParams}
            errorCallout={props.errorCallout}
            action={async (inputs) => {
              "use server"
              await props.action(inputs, dialog.context)
            }}
          />
        </dialog.Content>
      </>}
    </Dialog>
  )
}



export function MaterialSymbolsEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" /></svg>
  )
}