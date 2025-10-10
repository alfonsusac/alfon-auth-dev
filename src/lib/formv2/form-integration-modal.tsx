import { Modal } from "../dialogsv2/modal"
import { ModalButton } from "../dialogsv2/modal.client"
import { searchParams } from "../page"
import type { FormType } from "./form"
import type { DefaultValues, ResultHandler } from "./form-component"

// export async function EditFormDialog<F extends FormType>(props: {
//   form: F,
//   dialogName: string,
//   defaultValues: DefaultValues<F['fields']>,
//   navigateOnSubmit?: ResultHandler<F['fields'], string>,
//   context?: PageContext,
// }) {
//   const sp = await searchParams()

//   return <>
//     <Modal name={props.dialogName} context={props.context}>
//       {dialog => <>
//         <ModalButton
//       </>}
//     </Modal>
//   </>
// }