import { adminOnly } from "@/lib/auth"
import { getProject } from "@/services/projects"
import { ProjectKeyNotFound, ProjectNotFound } from "../../shared"
import BackButton from "@/lib/BackButton"
import { SuccessCallout } from "@/lib/toast/SearchParamsCalloutClient"
import { Breadcrumb } from "@/lib/Breadcrumb"
import { formatDate } from "@/lib/date"
import { DataGridDisplay } from "@/lib/DataGrid"

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
      "created": "key created successfully!",
      "updated": "key updated!"
    }} />

    <header>
      <Breadcrumb items={[project.name, "Key"]} />
      <h1 className="page-h1">{key.name}</h1>

      <DataGridDisplay data={{
        'key secret': key.client_secret,
        'created at': key.createdAt,
        'updated at': key.updatedAt
      }} />
    </header>

    {props.children}
  </>
}