import { Modal } from "@/lib/dialogsv2/modal"
import { IconEdit } from "../../shared/icons"
import { Dialog } from "@/lib/dialogsv2/dialog"
import { Form, type FormProps } from "@/module/form"
import type { FormFields } from "@/module/action/form-action"

export function EditFormDialogButton<
  O,
  F extends FormFields
>(Props:
  & { name: string, context?: PageContext }
  & FormProps<O, F>
) {
  const { form, extend, onSuccess, ...rest } = Props
  return <>
    <Modal
      name={"edit_" + rest.name}
      context={rest.context}
      button={
        <Modal.Trigger className={"button small"}>
          <IconEdit className="mt-0.5 mr-1" /> Edit Details
        </Modal.Trigger>
      }
      content={dialog => {
        return <Dialog title={"Edit " + rest.name} wide>
          <Form
            form={form}
            onSuccess={onSuccess}
            extend={extend}
          />
        </Dialog>
      }
      }
    />
  </>
}




// type GenericComponent2Props<F extends boolean> = F extends true ? { a: string } : { b: number }

// function GenericComponent2<F extends boolean>(props: { x: F } & GenericComponent2Props<F>) {
//   return <></>
// }

// function GenericWrapperComponent2<F extends boolean>(props: { x: F } & GenericComponent2Props<F>) {
//   const { x, ...rest } = props
//   return <GenericComponent2 x={x} {...(genericProps as GenericComponent2Props<F>)} />
// }

// (() => {
//   return <GenericComponent2 x={true} a={'s'} />
// })()