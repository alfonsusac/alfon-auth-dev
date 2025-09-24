import { actionAdminOnly, getCurrentUser, isAdmin } from "@/lib/auth"
import { NotFoundLayout, UnauthorizedLayout } from "@/lib/NotFound"
import { getProject, getProjectKey } from "@/services/projects"
import { redirect } from "next/navigation"

function unauthorized(redirect_to: string) {
  return redirect(redirect_to)
}


export const pageData = {

  projectPage:
    async (props: PageProps<'/[projectid]'>) => {

      const params = await props.params
      const projectid = decodeURIComponent(params.projectid)

      const project = await getProject(projectid)
      if (!project) return {
        error: <NotFoundLayout
          thingName="Project"
          info={`The project with ID "${ projectid }" does not exist.`}
          backLabel="Back to Home"
          backHref="/"
        />,
      }
      return { params, project }
    },

  projectKeyPage:
    async (props: PageProps<'/[projectid]/key/[keyid]'>) => {

      const { project, error } = await pageData.projectPage(props as any)
      if (error) return { error }

      const params = await props.params
      const keyid = decodeURIComponent(params.keyid)

      const user = await getCurrentUser()
      if (!user || !isAdmin(user)) return {
        error: <UnauthorizedLayout
          backLabel={`Back to ${ project.name }`}
          backHref={`/${ project.id }`}
        />
      }

      const key = await getProjectKey(keyid)
      if (!key || key.project_id !== project.id) return {
        error: <NotFoundLayout
          thingName="Project Key"
          info={`The project key with ID "${ params.keyid }" does not exist in project "${ params.projectid }".`}
          backLabel={`Back to ${ project.name }`}
          backHref={`/${ project.id }`}
        />
      }
      return { project, key }

    }


}

// Test:
// http://localhost:3000/Testsadf/key/9931756a-4b35-4c09-8d7d-dd582564c387