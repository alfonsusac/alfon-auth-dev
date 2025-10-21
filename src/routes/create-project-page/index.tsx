import { page, unauthorized } from "@/lib/page"
import { Title, Section } from "@/lib/primitives"
import { navigate } from "@/lib/navigate"
import { createProjectForm } from "./project-create-form"
import { Form } from "@/lib/formv2/form-component"
import { route } from "../routes"
import { DetailPage } from "@/lib/page-templates"
import { Spacer } from "@/lib/spacer"

export default page('/create-project', async page => {

  if (!page.user?.isAdmin)
    return unauthorized('Back to Home', '/')

  return <>
    <DetailPage back={['Home', '/']} className="gap-0"> 

      <Title>Create Project</Title>
      <Spacer />

      <Form
        form={createProjectForm}
        onSubmit={async ({ inputs }) => {
          "use server"
          navigate.push(route.projectPage(inputs.id), { success: 'created' })
        }}
      />

    </DetailPage>
  </>
})