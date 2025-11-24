import { Modal, type ModalProps } from "@/lib/dialogsv2/modal"
import { Dialog } from "@/lib/dialogsv2/dialog"
import { Form, type FormProps } from "../form"
import type { FormFields } from "../action/form-action"

export function FormDialogButton<
  O,
  F extends FormFields,
>(opts:
  & { title: string }
  & Omit<ModalProps, "content">
  & FormProps<O, F>
) {
  const { form, extend, onSuccess, ...rest } = opts
  return <>
    <Modal
      {...rest}
      content={modal => <Dialog
        title={opts.title}
      >
        <Form
          form={form}
          onSuccess={onSuccess}
          extend={extend}
        />
      </Dialog>}
    />
  </>
}