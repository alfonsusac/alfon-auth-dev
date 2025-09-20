import { data } from "@/data"
import { $getCurrentUser, adminOnly, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import prisma from "@/lib/db"
import { FormButton } from "@/lib/FormButton"
import { resolveError, unauthorizedAction } from "@/lib/redirects"
import { createProjectKeys, deleteProjectKeys } from "@/services/projects"
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

  const user = await $getCurrentUser()

  return <>
    <BackButton href="/">Home</BackButton>
    {
      info === "new" && <>
        <div className="callout success">
          project created successfully!
        </div>
      </>
    }
    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="font-mono text-xs tracking-tight text-foreground-body">
        auth.alfon.dev/{projectid}
      </code>
    </header>

    <section className="flex flex-col gap-2">
      <a className="button destructive small" href={`/${ projectid }/delete`}>Delete Project</a>
    </section>

    {
      isAdmin(user) &&
      <>
        <section className="flex flex-col gap-2 max-w-120">
          <p className="text-pretty text-sm text-foreground-body">project keys ↓</p>
          {project.ProjectKey.length === 0 && <div className="text-sm text-foreground-body py-4">No API keys found.</div>}
          <ul className="flex flex-col gap-2">
            {project.ProjectKey.map((key) => <li key={key.id}>
              <div
                className="card"
              >
                <div className="flex flex-col items-start gap-1 grow min-w-0">
                  <div className="font-mono font-semibold leading-3 text-xs rounded-sm truncate min-w-0 w-full">
                    {key.key}
                  </div>
                  <div className="text-foreground-body leading-3 text-xs">
                    {key.description}
                  </div>
                  <div className="text-foreground-body/75 leading-3 text-xs">
                    {key.createdAt.toDateString()}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={async () => {
                    "use server"
                    await adminOnly(`/${ projectid }`)
                    const res = await deleteProjectKeys(key.id)
                    resolveError(`/${ projectid }`, res)
                    revalidatePath(`/${ projectid }`)
                  }}>
                    <FormButton className="button small -mr-2 -mt-2"
                      loading="Deleting...">
                      Delete
                    </FormButton>
                  </form>
                </div>
              </div>
            </li>)}
          </ul>
          <form action={async () => {
            "use server"
            await adminOnly(`/${ projectid }`)
            const res = await createProjectKeys(project.id, "New API Key")
            resolveError(`/${ projectid }`, res)
            revalidatePath(`/${ projectid }`)
          }} className="w-full self-stretch">
            <FormButton className="button list"
              loading={"Creating..."}>
              <div>+</div>
              <div>Create API Key</div>
            </FormButton>
          </form>
        </section>
        <section className="flex flex-col gap-2 max-w-120">
          <p className="text-pretty text-sm text-foreground-body">api references ↓</p>
          <div className="flex flex-col gap-2">
            <div className="card">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <div className="font-mono font-semibold leading-3">
                    GET /authorize
                  </div>
                  <div className="font-mono text-xs leading-3 tracking-tight text-foreground-body">
                    auth.alfon.dev/{projectid}/authorize
                  </div>
                </div>
                <p className="text-xs text-foreground-body">
                  Redirects to the OAuth provider for authentication. Requires an API key in the Authorization header.
                </p>
                <div className="flex gap-2">
                  <button className="button small">
                    Copy URL
                  </button>
                  <a className="button small" href={`/${ projectid }/login`}>
                    Log In to Project
                  </a>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex flex-col gap-1">
                <div className="font-mono font-semibold">
                  POST /token
                </div>
                <p className="text-xs text-foreground-body">
                  Exchanges an authorization code for an access token. Requires an API key in the Authorization header.
                </p>
                <button className="button small mt-2">
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    }

  </>

}