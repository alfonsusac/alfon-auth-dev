import { adminOnly } from "@/lib/auth"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { deleteProjectKey, getProject } from "@/services/projects"
import { ProjectKeyNotFound, ProjectNotFound } from "../../../shared"
import BackButton from "@/lib/BackButton"
import { DeleteAlert } from "@/lib/DeleteAlert"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { navigate } from "@/lib/resolveAction"

export default async function DeleteProjectKeyPage(props: {
  params: Promise<{ projectid: string, keyid: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const projectid = params.projectid
  const keyid = params.keyid
  await adminOnly(`/${ projectid }`)

  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const key = (await project.keys()).find(k => k.id === keyid)
  if (!key) return <ProjectKeyNotFound key_id={keyid} project_id={projectid} />

  return (
    <>
      <BackButton href={`/${ projectid }/key/${ keyid }`}>{project.name}</BackButton>

      <header>
        <Breadcrumb items={[project.name, "Key"]} />
        <h1 className="page-h1">{key.name}</h1>
        <code className="page-subtitle-code">key secret: {key.client_secret}</code>
        <p className="page-subtitle ">Created: {key.createdAt.toLocaleString()}</p>
      </header>

      <DeleteAlert
        title={`Are you sure you want to permanently this API key?`}
        description="This action cannot be undone. All existing integrations that uses this API key will stop working."
        backHref={`/${ projectid }/key/${ keyid }`}
        actionLabel="Delete Project Key"
        action={async () => {
          "use server"
          await adminOnly()
          const res = await deleteProjectKey(keyid)
          resolveError(`/${ projectid }/key/${ keyid }`, res)
          revalidatePath(`/${ projectid }`)
          navigate(`/${ projectid }?info=key_deleted`)
        }}
      />
    </>
  )

}