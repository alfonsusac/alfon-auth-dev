// export default async function ProjectPageRoute(props: PageProps<"/[projectid]">) {

import { Page, page, type AppPageContext } from "@/lib/page"
import { getProject } from "@/services/projects"
import { projectNotFound } from "./page.components"
import { DataGridDisplay } from "@/lib/DataGrid"
import { AUTH } from "@/lib/auth_ui"
import { Dialog } from "@/lib/dialogs/dialog"


export default page('/[projectid]', async props => {

  const { projectid } = props
  const project = await getProject(projectid)
  if (!project) return projectNotFound(projectid)

  return (
    <Page
      toasts={{
        new: "project created successfully!",
        key_deleted: "key deleted successfully!",
        domain_deleted: "domain deleted successfully!",
        updated: "project updated!",
      }}
      back={['Home', '/']}
    >
      <header>
        <h1 className="page-h1">{project.name}</h1>
        <DataGridDisplay data={{
          'project id': project.id,
          'description': project.description,
          'updated at': new Date(project.updatedAt),
          'created at': new Date(project.createdAt),
        }} />
      </header>

      <AUTH.AdminOnly>
        {/* <ProjectPageAdminOnlySection {...props} /> */}
      </AUTH.AdminOnly>

    </Page >
  )
}
)

// function ProjectPageAdminOnlySection(props: AppPageContext<'/[projectid]'>) {
//   return <>
//     {/*  Project Domains List */}
//     {/*  Project Keys List */}

//     <Dialog>

//     </Dialog>
//   </>
// }