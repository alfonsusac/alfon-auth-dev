import { adminOnly, getCurrentUser, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { form } from "@/lib/AppForm"
import { resolveError } from "@/lib/redirects"
import { navigate } from "@/lib/resolveAction"
import { ErrorCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { createProject } from "@/services/projects"
import { Link } from "@/lib/Link"

export default async function ProjectPage(props: PageProps<'/create-project'>) {

  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) return <>
    <section>
      <h1 className="page-h1">Unauthorised</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        Please log in in order to create a project.
      </p>
    </section>

    <Link href="/" className="button primary">{'<-'} Back to Home</Link>
  </>

  return <>
    <BackButton href="/">Home</BackButton>

    <header>
      <h1 className="page-h1">Create Project</h1>
    </header>

    <form.CreateForm
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
      }}
      action={async (inputs) => {
        "use server"
        await adminOnly()
        const res = await createProject(inputs)
        resolveError(`/create-project`, res, inputs)
        navigate(`/${ inputs.id }?success=created`)
      }}
      errorCallout={
        <ErrorCallout<typeof createProject> messages={{
          id_exists: "project id already exists.",
          missing_fields: "missing required fields.",
          invalid_id: "project id can only contain alphanumeric characters, dashes and underscores.",
        }} />
      }
      searchParams={await props.searchParams}
    />
  </>

}