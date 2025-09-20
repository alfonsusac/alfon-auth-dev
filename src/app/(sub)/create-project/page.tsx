import { $getCurrentUser, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { FormButton } from "@/lib/FormButton"
import { createProject } from "@/services/projects"
import { redirect } from "next/navigation"

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const user = await $getCurrentUser()

  if (!user || !isAdmin(user)) return <>
    <section>
      <h1 className="page-h1">Unauthorised</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        Please log in in order to create a project.
      </p>
    </section>

    <a href="/" className="button primary">{'<-'} Back to Home</a>
  </>

  const sp = await searchParams
  const error = sp['error']

  return <>
    <BackButton href="/">Home</BackButton>

    <header>
      <h1 className="page-h1">Create Project</h1>
    </header>

    <form className="flex flex-col gap-6 max-w-80" action={async (form: FormData) => {
      "use server"
      const user = await $getCurrentUser()
      if (!user) redirect('/create-project')

      const id = form.get("id")?.toString()
      const name = form.get("name")?.toString()

      const res = await createProject(id, name, "")
      if (typeof res === "string")
        redirect(`/create-project?error=${ res }`)

      redirect(`/${ id }?info=new`)
    }}>
      <div className="flex flex-col gap-0.5">
        <label className="label" >project id</label>
        <p className="label-helper">will be used at the auth url</p>
        <div className="flex items-center gap-2 input">
          <div className="text-foreground-body">auth.alfon.dev/</div>
          <input className="grow -my-2 py-2 pr-2 -mr-2" name="id" placeholder="project_id" required />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="label" >project name</label>
        <p className="label-helper">will be used as the display of the project</p>
        <input className="input" name="name" placeholder="My Project" required />
      </div>
      {
        error === "id_exists" && <>
          <div className="callout error">
            project id already exists.
          </div>
        </>
      }
      <FormButton className="button primary px-6 mt-4 w-30"
        loading="Creating..."
      >Create</FormButton>
    </form>
  </>

}