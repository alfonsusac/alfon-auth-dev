import { logout, signIn, signInAdminLocalhost } from "@/lib/auth"
import { AUTH } from "@/lib/auth_ui"
import { Form } from "@/lib/basic-form/form"
import { actionNavigate } from "@/lib/resolveAction"
import { SuccessCallout } from "@/lib/toast/search-param-toast.client"
import { meta } from "@/meta"
import Link from "next/link"
import { pageData } from "./data"

export default async function Home() {

  const { user, projects } = await pageData.homePage()
  const no_projects = projects.length === 0

  return (
    <main className="font-sans flex flex-col gap-16">

      <SuccessCallout messages={{
        account_created: 'Account created successfully!',
        logged_out: 'Logged out successfully!',
        project_deleted: 'Project deleted successfully!',
      }} />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="text-pretty text-sm max-w-80 text-foreground-body">
          {meta.description}
        </p>
      </header>

      <div className="category">
        <p className="category-header">manage your accounts ↓</p>
        {
          user ?
            <div className="flex gap-2">
              <Link href="#" className="button primary px-12!">
                My Account
              </Link>

              <Form action={async () => {
                "use server"
                await logout()
                actionNavigate('/?success=logged_out')
              }}>
                <button className="button">
                  Log Out
                </button>
              </Form>
            </div>
            :
            <div className="flex gap-2 flex-wrap">
              <Form action={async () => {
                "use server"
                await signIn()
              }}>
                <button className="button primary">Login via Google</button>
              </Form>
              {process.env.NODE_ENV === 'development' && <Form action={async () => {
                "use server"
                await signInAdminLocalhost()
              }}>
                <button className="button">Login as Admin Localhost</button>
              </Form>}
            </div>
        }
      </div>

      <section className="category">
        <p className="category-header">my projects ↓</p>
        {no_projects && <div className="text-xs text-foreground-body my-4">no projects found.</div>}

        <div className="flex flex-col gap-px">
          <ul className="list">
            {projects.map(project => {
              return <li key={project.id}>
                <Link
                  href={`/${ project.id }`}
                  className="list-row">
                  <div>
                    <p className="font-medium text-sm leading-tight tracking-tight">
                      {project.name}
                    </p>
                    <p className="text-sm min-h-lh leading-3 line-clamp-1 text-foreground-body/75 text-xs">
                      <span className="text-foreground-body/50 font-normal text-xs">/{project.id}</span> - {project.description ? project.description : <span className=" text-foreground-body/50 text-xs">No description</span>}
                    </p>
                  </div>
                </Link>
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
