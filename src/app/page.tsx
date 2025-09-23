import { getCurrentUser, logout, signIn } from "@/lib/auth"
import { AUTH } from "@/lib/auth_ui"
import { Form } from "@/lib/basic-form/Form"
import { SPCallout } from "@/lib/SearchParamsCallout"
import { meta } from "@/meta"
import { getAllProjects } from "@/services/projects"
import Link from "next/link"

export default async function Home(props: PageProps<'/'>) {

  const user = await getCurrentUser()
  const projects = await getAllProjects()
  const no_projects = projects.length === 0

  return (
    <main className="font-sans flex flex-col gap-16">

      <SPCallout sp={props.searchParams} match="info=deleted" className="success">project deleted successfully!</SPCallout>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="text-pretty text-sm max-w-80 text-foreground-body">
          {meta.description}
        </p>
      </header>

      <div className="category">
        <p className="category-title">manage your accounts ↓</p>
        {
          user ?
            <div className="flex gap-2">
              <Link href="#" className="button primary px-12!">
                My Account
              </Link>
              <Form action={async () => {
                "use server"
                await logout()
              }}>
                <button className="button">
                  Log Out
                </button>
              </Form>
            </div>
            :
            <Form action={async () => {
              "use server"
              await signIn()
            }}>
              <button className="button primary">Login via Google</button>
            </Form>
        }
      </div>

      <section className="category">
        <p className="category-title">my projects ↓</p>
        {no_projects && <div className="text-xs text-foreground-body my-4">no projects found.</div>}

        <div className="flex flex-col gap-px">
          <ul className="list">
            {projects.map(project => {
              return <li key={project.id}>
                <a
                  href={`/${ project.id }`}
                  className="list-row">
                  <div>
                    <p className="font-medium text-sm leading-tight tracking-tight">{project.name}</p>
                    <p className="text-sm text-foreground-body min-h-lh leading-3">
                      {project.description ? project.description : <span className=" text-foreground-body/50 text-xs">No description</span>}
                    </p>
                  </div>
                </a>
              </li>
            })}
          </ul>
        </div>

        <AUTH.AdminOnly>
          <Link className="button primary small" href="/create-project">
            Create Project
          </Link>
        </AUTH.AdminOnly>
      </section>

    </main>
  )
}
