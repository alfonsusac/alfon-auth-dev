import { data } from "@/data"
import { getCurrentUser, logout, signIn } from "@/lib/auth"
import { meta } from "@/meta"

export default async function Home() {

  const user = await getCurrentUser()


  return (
    <main className="font-sans flex flex-col gap-16">

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="text-pretty text-sm max-w-80 text-foreground-body">
          {meta.description}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <p className="text-pretty text-sm text-foreground-body">manage your accounts ↓</p>
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


      <section className="max-w-120">
        <p className="text-pretty text-sm text-foreground-body">my projects ↓</p>
        <ul className="flex flex-col gap-4 mt-4">
          {data.projects.map(project => {
            return <li key={project.id}>
              <a
                href={`/${ project.id }`}
                className="hover:bg-backgroud-hover active:bg-backgroud-active block -mx-3 px-3 -my-2 py-2 rounded-md cursor-pointer">
                <div>
                  <p className="font-medium text-sm leading-tight">{project.name}</p>
                  <p className="text-sm text-foreground-body">{project.description}</p>
                </div>
              </a>
            </li>
          })}
        </ul>
      </section>

    </main>
  )
}
