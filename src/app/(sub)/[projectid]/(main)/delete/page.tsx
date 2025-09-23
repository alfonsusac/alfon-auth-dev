import { adminOnly } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { DeleteAlert } from "@/lib/DeleteAlert"
import { NotFoundLayout } from "@/lib/NotFound"
import { resolveError } from "@/lib/redirects"
import { navigate } from "@/lib/resolveAction"
import { deleteProject, getProject } from "@/services/projects"
import { revalidatePath } from "next/cache"

export default async function DeleteProjectPage(props: {
  params: Promise<{ projectid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const projectid = decodeURIComponent((await props.params).projectid)
  await adminOnly(`/${ projectid }`)

  const project = await getProject(projectid)
  if (!project) return <NotFoundLayout
    title="Project Not Found"
    info={`The project with ID "${ projectid }" does not exist.`}
    backLabel="Back to Home"
    backHref="/"
  />

  return <>
    <BackButton href={`/${ projectid }`}>{project.name}</BackButton>

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">auth.alfon.dev/{projectid}</code>
    </header>

    <DeleteAlert
      title={`Are you sure you want to permanently delete "${ project.name }"?`}
      description="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
      backHref={`/${ projectid }`}
      actionLabel="Delete Project"
      action={async () => {
        "use server"
        const res = await deleteProject(projectid)
        resolveError(`/${ projectid }/delete`, res)
        revalidatePath('/')
        navigate('/?success=deletedss')
      }}
    />
  </>
}