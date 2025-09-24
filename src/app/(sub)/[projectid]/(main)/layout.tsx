import BackButton from "@/lib/BackButton"
import { getProject } from "@/services/projects"
import { ProjectNotFound } from "../shared"
import { DataGridDisplay } from "@/lib/DataGrid"

export default async function Project(props: LayoutProps<'/[projectid]'>) {

  const projectid = decodeURIComponent((await props.params).projectid)
  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  return <>
    <BackButton href="/">Home</BackButton>

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        {/* auth.alfon.dev/{projectid} */}
        auth.alfon.dev/{projectid}
      </code>
      <DataGridDisplay data={{
        'created at': project.createdAt,
        'updated at': project.updatedAt
      }} />
    </header>


    {props.children}
  </>
}