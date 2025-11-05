import { page, unauthorized } from "@/lib/next/next-page"
import { Title } from "@/lib/primitives"
import { createProjectForm } from "./project-create-form"
import { Form } from "@/module/form"
import { DetailPage } from "@/lib/page-templates"
import { navigate } from "@/module/navigation"
import { projectPageRoute } from "../routes"

export default page('/create-project', async page => {

  if (!page.user?.isAdmin)
    return unauthorized('Back to Home', '/')

  return <>
    <DetailPage back={['Home', '/']}>
      <Title>Create Project</Title>
      <Form
        form={createProjectForm}
        onSuccess={async action => {
          "use server"
          navigate.push(projectPageRoute(action.inputs.id), { success: 'project_created' })
        }}
      />
    </DetailPage>
  </>

})

