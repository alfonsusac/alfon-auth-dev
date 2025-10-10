import { Page, page, unauthorized } from "@/lib/page"
import { Title, Section } from "@/lib/primitives"
import { navigate } from "@/lib/resolveAction"
import { createProjectForm } from "./project-create-form"
import { Form } from "@/lib/formv2/form-component"
import { route } from "../routes"

export default page('/create-project', async page => {

  if (!page.user?.isAdmin)
    return unauthorized('Back to Home', '/')

  return <>
    <Page back={['Home', '/']}>

      <Title>Create Project</Title>

      <Section>
        <Form
          form={createProjectForm}
          defaultValues={{ name: 'New Project' }}
          onSubmit={async ({ inputs }) => {
            "use server"
            navigate.push(route.projectPage(inputs.id), { success: 'created' })
          }}
        />
      </Section>

    </Page>
  </>
})