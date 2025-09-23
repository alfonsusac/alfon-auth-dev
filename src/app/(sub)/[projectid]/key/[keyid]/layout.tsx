import { adminOnly } from "@/lib/auth"
import { getProject } from "@/services/projects"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import BackButton from "@/lib/BackButton"
import { SuccessCallout } from "@/lib/SearchParamsCalloutClient"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { formatDate } from "@/lib/date"

export default async function ProjectKeyLayout(props: LayoutProps<'/[projectid]/key/[keyid]'>) {
  const params = await props.params
  const projectid = params.projectid
  await adminOnly(`/${ projectid }`)

  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const key = (await project.keys()).find(k => k.id === params.keyid)
  if (!key) return <ProjectKeyNotFound key_id={params.keyid} project_id={projectid} />

  return <>
    <BackButton href={`/${ projectid }`}>Back to Project</BackButton>

    <SuccessCallout messages={{
      "key_created": "key created successfully!",
      "key_updated": "key updated!"
    }} />

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{key.name}</h1>

      <div className="grid grid-cols-[auto_1fr] page-subtitle mt-3 gap-1 gap-x-4">

        <div className="opacity-50">key secret</div>
        <div>{key.client_secret}</div>

        <div className="opacity-50">created at</div>
        <div>{formatDate(key.createdAt)}</div>

        <div className="opacity-50">updated at</div>
        <div>{formatDate(key.updatedAt)}</div>

      </div>
    </header>

    {props.children}
  </>
}