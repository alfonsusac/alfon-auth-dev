import { SuccessCallout } from "@/lib/next/next-search-param-toast.client"
import { meta } from "@/meta"
import Link from "next/link"
import { List } from "@/lib/primitives"
import { LogInDevelopmentButton, LogInViaGoogleButton, LogOutButton } from "@/shared/auth/login-button"
import { AdminOnly } from "@/shared/auth/admin-only"
import { getUser } from "@/shared/auth/auth"
import { getAllProjects } from "@/services/ project/db"

export default async function Home() {

  const user = await getUser()
  const projects = await getAllProjects()

  return (
    <main className="font-sans flex flex-col gap-16">

      <SuccessCallout messages={{
        account_created: 'Account created successfully!',
        logged_out: 'Logged out successfully!',
        project_deleted: 'Project deleted successfully!',
      }} />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight mt-8">
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
              <LogOutButton />
            </div>
            :
            <div className="flex gap-2 flex-wrap">
              <LogInViaGoogleButton />
              <LogInDevelopmentButton />
            </div>
        }
      </div>

      <section className="category">
        <p className="category-header">my projects ↓</p>

        <List val={projects} fallback="no projects found">
          {project => {
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
          }}
        </List>

        <AdminOnly>
          <Link className="button primary small" href="/create-project">
            Create Project
          </Link>
        </AdminOnly>
      </section>

    </main>
  )
}
