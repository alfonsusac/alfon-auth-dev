import { page, unauthorized } from "@/lib/next/next-page"
import { Title, Section } from "@/lib/primitives"
import { createProjectForm } from "./project-create-form"
import { Form } from "@/lib/formv2/form-component"
import { route } from "../routes"
import { DetailPage } from "@/lib/page-templates"
import { Spacer } from "@/lib/spacer"
import { navigate } from "@/module/navigation"

export default page('/create-project', async page => {

  if (!page.user?.isAdmin)
    return unauthorized('Back to Home', '/')

  return <>
    <DetailPage back={['Home', '/']}> 
      <Title>Create Project</Title>
      <Form form={createProjectForm}
        onSubmit={async ({ inputs }) => {
          "use server"
          navigate.push(route.projectPage(inputs.id), { success: 'created' })
        }}
      />
    </DetailPage>
  </>
})