import { data } from "@/data"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import prisma from "@/lib/db"
import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function ProjectPage(props: {
  params: Promise<{ projectid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const projectid = (await props.params).projectid

  const project = await prisma.project.findFirst({
    where: { id: projectid },
    include: {
      ProjectKey: true
    }
  })

  if (!project) return <>
    <section>
      <h1 className="page-h1">Project Not Found</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        The project with ID "{projectid}" does not exist.
      </p>
    </section>

    <a href="/" className="button primary">{'<-'} Back to Home</a>
  </>

  const sp = await props.searchParams
  const info = sp['info']

  const user = await getCurrentUser()

  return <>
    {
      info === "new" && <>
        <div className="callout success">
          project created successfully!
        </div>
      </>
    }
    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="font-mono text-sm tracking-tight text-foreground-body">{projectid}</code>
    </header>

    {
      isAdmin(user) &&
      <section className="flex flex-col gap-2">
        <p className="text-pretty text-sm text-foreground-body">project keys ↓</p>
        {project.ProjectKey.length === 0 && <div className="text-sm text-foreground-body py-4">No API keys found.</div>}
        <ul className="flex flex-col gap-2">
          {project.ProjectKey.map((key) => <li key={key.id}>
            <div
              className=" rounded-md -mx-3 px-3 py-2 flex flex-col gap-1"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="font-mono bg-foreground/5 p-1 leading-3 text-sm rounded-sm">{key.key}</div>
                <div className="text-foreground-body text-xs">{key.description}</div>
              </div>
              <div className="flex gap-2">
                <form action={async () => {
                  "use server"
                  const user = await getCurrentUser()
                  if (!isAdmin(user)) redirect(`/${ projectid }?error=not_authorized`)
                  await prisma.projectKey.delete({
                    where: { id: key.id }
                  })
                  revalidatePath(`/${ projectid }`)
                }}>
                  <button className="button py-1">Delete</button>
                </form>
              </div>
            </div>
          </li>)}
        </ul>
        <form action={async () => {
          "use server"
          const user = await getCurrentUser()
          if (!isAdmin(user)) redirect(`/${ projectid }?error=not_authorized`)
          await prisma.projectKey.create({
            data: {
              projectId: project.id,
              description: "New API Key",
              key: randomBytes(16).toString('hex')
            }
          })
          revalidatePath(`/${ projectid }`)
        }}>
          <button className="button ghost -mx-2 pr-24">+ Create API Key</button>
        </form>
      </section>
    }

  </>

}