// import { form } from "../AppForm"
// import { DialogButton, DialogPaper } from "./Dialog"

// export function EditDialogButton(props: {
//   label?: string,
// }) {
//   return <DialogButton
//     name="edit"
//     label={props.label}
//   >
//     <DialogPaper>
//       <form.EditForm
//         name="edit_project"
//         fields={{
//           name: {
//             label: "project name",
//             helper: "give your project a name for identification",
//             type: "text",
//             defaultValue: project.name,
//             required: true
//           },
//           id: {
//             label: "project id",
//             helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
//             type: "text",
//             prefix: "https://auth.alfon.dev/",
//             defaultValue: project.id ?? "",
//             required: true
//           },
//           description: {
//             label: "description",
//             helper: "describe your project for future reference (optional)",
//             type: "text",
//             defaultValue: project.description ?? "",
//             required: false
//           }
//         }}
//         action={async (inputs) => {
//           "use server"
//           await actionAdminOnly(`/${ project.id }`)
//           const res = await updateProject(inputs, project.id)
//           resolveError(`/${ project.id }`, res)
//           revalidatePath(`/${ project.id }`, 'layout')
//           actionNavigate(`/${ inputs.id }?success=updated+${ nanoid(3) }`, "replace")
//         }}
//         searchParams={await props.searchParams}
//         errorCallout={<ErrorCallout<typeof updateProject> messages={{
//           invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
//           missing_fields: "please fill out all required fields.",
//           not_found: "project not found.",
//         }} />}
//       />
//     </DialogPaper>
//   </DialogButton>
// }