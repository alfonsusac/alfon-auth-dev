import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Modal, type ModalProps } from "@/lib/dialogsv2/modal"
import { Form, type FormProps } from "../form"
import type { FormType } from "@/lib/formv2/form"
import { Dialog } from "@/lib/dialogsv2/dialog"

export function FormDialogButton<F extends FormType>(opts:
  & { title: string }
  & Omit<ModalProps, "content">
  & FormProps<F>
) {
  return <>
    <Modal
      name={opts.name}
      context={opts.context}
      button={opts.button}
      content={modal => <Dialog
        title={opts.title}
      >
        <Form
          form={opts.form}
          onSuccess={opts.onSuccess}
        />
      </Dialog>}
    />
  </>
}