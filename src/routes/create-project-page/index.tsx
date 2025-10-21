import { page, unauthorized } from "@/lib/page"
import { Title, Section } from "@/lib/primitives"
import { navigate } from "@/lib/navigate"
import { createProjectForm } from "./project-create-form"
import { Form } from "@/lib/formv2/form-component"
import { route } from "../routes"
import { DetailPage } from "@/lib/page-templates"

export default page('/create-project', async page => {

  if (!page.user?.isAdmin)
    return unauthorized('Back to Home', '/')

  return <>
    <DetailPage back={['Home', '/']}>

      <Title>Create Project</Title>

      <Section>
        <Form
          form={createProjectForm}
          onSubmit={async ({ inputs, result }) => {
            "use server"
            navigate.push(route.projectPage(inputs.id), { success: 'created' })
          }}
        />
      </Section>

    </DetailPage>
  </>
})