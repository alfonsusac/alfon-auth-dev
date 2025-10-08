import BackButton from "@/lib/BackButton"
import { pageData } from "@/app/data"
import { CreateProjectForm } from "@/lib/formv2/form-component"
import { Header, Section, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import { Page } from "@/lib/page"

export default async function CreateProjectPage(props: PageProps<'/create-project'>) {

  const { error } = await pageData.createProjectPage()
  if (error) return error

  return <Page back={['Home', '/']}>

    <Title>Create Project</Title>

    <Section>
      <CreateProjectForm />
    </Section>

    {/* <form.CreateForm
      name="create-project"
      fields={{
        id: {
          type: "text",
          required: true,
          label: "project id",
          helper: "will be used at the auth url",
          prefix: "auth.alfon.dev/",
          placeholder: "project_id",
        },
        name: {
          type: "text",
          required: true,
          label: "project name",
          helper: "will be used as the display of the project",
          placeholder: "My Project",
        },
        description: {
          type: "text",
          label: "description",
          helper: "a short description of the project",
          placeholder: "This is my project",
        }
      }}
      action={async (inputs) => {
        "use server"
        const user = await actionAdminOnly()
        const res = await createProject(inputs, user.id)
        actionResolveError(res, inputs)
        revalidatePath('/', "layout")
        actionNavigate(`/${ inputs.id }?success=created`)
      }}
      errorCallout={
        <ErrorCallout<typeof createProject> messages={{
          id_exists: "project id already exists.",
          missing_fields: "missing required fields.",
          invalid_id: "project id can only contain alphanumeric characters, dashes and underscores.",
        }} />
      }
      searchParams={await props.searchParams}
    /> */}
  </Page>

}