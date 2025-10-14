import { pageData } from "@/app/data"
import authorizePage from "@/routes/authorize-page"
import { getAllProjectDomainsOfProject, getProject } from "@/services/projects"

export default authorizePage.Page

// export default async function ProjectAuthorizationPage(
//   props: PageProps<'/[projectid]/authorize'>
// ) {
//   const res = await validateAuthorizationParameters(props)
//   if (typeof res === 'string') return <>
//     <div className="fixed inset-0 bg-red-500 flex items-center justify-center">
//       <h1 className="text-white text-2xl">{res}</h1>
//     </div>
//   </>

//   return (
//     <div className="fixed inset-0 bg-red-500">
//       <h1>Hello</h1>
//     </div>
//   )

// }

async function validateAuthorizationParameters(props: PageProps<'/[projectid]/authorize'>) {
  const { projectid, searchParams } = await pageData.resolve(props)

  const redirect_uri = searchParams['redirect_uri']
  if (!redirect_uri) return "Invalid Request: Missing redirect_uri"
  if (Array.isArray(redirect_uri)) return "Invalid Request: Multiple redirect_uri"

  const state = searchParams['state']
  if (!state) return "Invalid Request: Missing state. State is recommended for CSRF protection."

  const project_res = await getProject(projectid)
  if (!project_res) return "Project not found"

  // check for redirect_uri in project
  const project_redirect_uris = await getAllProjectDomainsOfProject(projectid)
  const matched_domain = project_redirect_uris.find((domain) => {
    return domain.redirect_url === redirect_uri
  })
  if (!matched_domain) return "Invalid redirect_uri"

  return project_res
}