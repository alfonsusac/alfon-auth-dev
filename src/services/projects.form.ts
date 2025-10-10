// import { actionAdminOnly } from "@/lib/auth"
// import { createForm } from "@/lib/basic-form/form"
// import { updateProject } from "./projects"

// export const EditProjectForm = createForm({
//   name: "edit-project",
//   fields: {
//     name: {
//       type: "text", required: true, autoFocus: true,
//       label: "project name",
//       helper: "give your project a name for identification",
//     },
//     id: {
//       type: "text", required: true,
//       label: "project id",
//       helper: "the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.",
//       prefix: "https://auth.alfon.dev/",
//     },
//     description: {
//       type: "text",
//       label: "description",
//       helper: "describe your project for future reference (optional)",
//     },
//   },
//   action: async (inputs, props: { projectid: string }) => {
//     "use server"
//     await actionAdminOnly(`/${ props.projectid }`)
//     return await updateProject(inputs, props.projectid)
//   },
// })({
//   invalid_id: "project id can only contain letters, numbers, hyphens, and underscores.",
//   missing_fields: "please fill out all required fields.",
//   not_found: "project not found.",
//   id_exists: "project id already exists.",
// })