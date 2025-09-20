import BackButton from "@/lib/BackButton"
import prisma from "@/lib/db"
import { resolveError } from "@/lib/redirects"
import { deleteProject } from "@/services/projects"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function DeleteProjectPage(props: {
  params: Promise<{ projectid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const projectid = (await props.params).projectid
  const project = await prisma.project.findFirst({ where: { id: projectid } })

  if (!project) return <>
    <section>
      <h1 className="page-h1">Project Not Found</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        The project with ID <span>{projectid}</span> does not exist.
      </p>
    </section>

    <a href="/" className="button primary">{'<-'} Back to Home</a>
  </>

  return <>
    <BackButton href={`/${ projectid }`}>{project.name}</BackButton>

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="font-mono text-xs tracking-tight text-foreground-body">
        auth.alfon.dev/{projectid}
      </code>
    </header>

    <section className="flex flex-col gap-2">
      <p className="text-pretty font-semibold tracking-tight max-w-120 text-foreground-body">
        Are you sure you want to delete the project <span className="font-semibold">{project.name}</span>? This action cannot be undone.
      </p>
      <p className="text-pretty text-xs max-w-120 text-foreground-body">
        All associated data, including users and keys, will be permanently removed.
      </p>
    </section>

    <div className="flex gap-2">
      <a href={`/${ projectid }`} className="button small">Cancel</a>
      <form action={async () => {
        "use server"
        const res = await deleteProject(projectid)
        resolveError(`/${projectid}/delete`, res)
        revalidatePath('/')
        redirect(`/?info=deleted`)
      }}>
        <button className="button destructive small">Delete Project</button>
      </form>
    </div>
  </>
}