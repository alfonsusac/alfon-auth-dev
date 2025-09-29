import { getCurrentUser, isAdmin } from "@/lib/auth"
import { NotFoundLayout, UnauthorizedLayout } from "@/lib/NotFound"
import { getAllProjects, getProject, getProjectDomain, getProjectKey } from "@/services/projects"

export const pageData = {

  resolve:
    async <P extends PageProps<any>>(props: P) => {
      const user = await getCurrentUser()
      const params = await props.params as Awaited<P['params']>
      const searchParams = await props.searchParams as Awaited<P['searchParams']>
      return { user, searchParams, ...params }
    },

  homePage:
    async () => {
      const user = await getCurrentUser()
      const projects = await getAllProjects()
      return { user, projects }
    },

  createProjectPage:
    async () => {
      const user = await getCurrentUser()
      if (!user || !isAdmin(user))
        return { error: <UnauthorizedLayout backLabel={`Back to Home`} backHref={`/`} /> }
      return { user }
    },

  projectPage2:
    async (projectid: string) => {
      const project = await getProject(projectid)
      if (!project) return {
        error: <NotFoundLayout
          thingName="Project"
          info={`The project with ID "${ projectid }" does not exist.`}
          backLabel="Back to Home"
          backHref="/"
        />,
      }
      return { project }
    },

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

    },

  domainPage:
    async (domainid: string) => {
      const domain = await getProjectDomain(domainid)
      if (!domain) return {
        error: <NotFoundLayout
          thingName="Project Domain"
          info={`The project domain with ID "${ domainid }" does not exist.`}
          backLabel="Back to Home"
          backHref="/"
        />,
      }
      return { domain }
    },

  projectDomainPage2:
    async (projectid: string, domainid: string) => {
      const { project, error } = await pageData.projectPage2(projectid)
      if (error) return { error }

      const { domain, error: error2 } = await pageData.domainPage(domainid)
      if (error2) return { error: error2 }

      if (domain.project_id !== project.id) return {
        error: <NotFoundLayout
          thingName="Project Domain"
          info={`The project domain with ID "${ domainid }" does not exist in project "${ projectid }".`}
          backLabel={`Back to ${ project.name }`}
          backHref={`/${ project.id }`}
        />,
      }

      return { project, domain }
    },

  projectDomainPage:
    async (props: PageProps<'/[projectid]/domain/[domainid]'>) => {

      const { project, error } = await pageData.projectPage(props as any)
      if (error) return { error }

      const params = await props.params
      const domainid = decodeURIComponent(params.domainid)

      const user = await getCurrentUser()
      if (!user || !isAdmin(user)) return {
        error: <UnauthorizedLayout
          backLabel={`Back to ${ project.name }`}
          backHref={`/${ project.id }`}
        />
      }

      const domain = await getProjectDomain(domainid)
      if (!domain || domain.project_id !== project.id) return {
        error: <NotFoundLayout
          thingName="Project Domain"
          info={`The project domain with ID "${ params.domainid }" does not exist in project "${ params.projectid }".`}
          backLabel={`Back to ${ project.name }`}
          backHref={`/${ project.id }`}
        />
      }
      return { project, domain }

    }


}

// Test:
// http://localhost:3000/Testsadf/key/9931756a-4b35-4c09-8d7d-dd582564c387