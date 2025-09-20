import { data } from "@/data"
import { $getCurrentUser, isAdmin, logout, signIn } from "@/lib/auth"
import prisma from "@/lib/db"
import { meta } from "@/meta"

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const user = await $getCurrentUser()

  const projects = await prisma.project.findMany({
    where: {
      user_id: process.env.ADMIN_USER_ID
    }
  }) ?? []

  const no_projects = projects.length === 0

  const sp = await props.searchParams
  const info = sp['info']


  return (
    <main className="font-sans flex flex-col gap-16">

      {
        info === "deleted" && <>
          <div className="callout success">
            project deleted successfully!
          </div>
        </>
      }

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="text-pretty text-sm max-w-80 text-foreground-body">
          {meta.description}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <p className="category-title">manage your accounts ↓</p>
        {
          user
            ? <div className="flex gap-2">
              <a className="button primary px-12!">
                My Account
              </a>
              <form action={async () => {
                "use server"
                await logout()
              }}>
                <button className="button">
                  Log Out
                </button>
              </form>
            </div>
            : <form action={async () => {
              "use server"
              await signIn()
            }}>
              <button className="button primary">Login via Google</button>
            </form>
        }
      </div>


      <section className="max-w-120 flex flex-col gap-2">
        <p className="category-title">my projects ↓</p>
        {no_projects && <div className="text-xs text-foreground-body my-4">no projects found.</div>}

        <div className="flex flex-col gap-px">
          <ul className="flex flex-col">
            {projects.map(project => {
              return <li key={project.id}>
                <a
                  href={`/${ project.id }`}
                  className="hover:bg-backgroud-hover active:bg-backgroud-active block  rounded-md cursor-pointer -mx-3 px-3 py-2">
                  <div>
                    <p className="font-medium text-sm leading-tight tracking-tight">{project.name}</p>
                    <p className="text-sm text-foreground-body min-h-lh">
                      {project.description ? project.description : <span className=" text-foreground-body/50 text-xs">No description</span>}
                    </p>
                  </div>
                </a>
              </li>
            })}
          </ul>
          {
            isAdmin(user) &&
            <a className="button list -mx-3" href="/create-project">
              + Create Project
            </a>
          }
        </div>

      </section>

    </main>
  )
}
