import { actionAdminOnly } from "@/lib/auth"
import { NotFoundLayout } from "@/lib/NotFound"
import { getProject } from "@/services/projects"
import { notFound } from "next/navigation"

export default async function DomainPageLayout(props: LayoutProps<'/[projectid]/domain/[domainid]'>) {
  const params = await props.params
  const projectid = params.projectid
  await actionAdminOnly(`/${ projectid }`)

  const project = await getProject(params.projectid)
  if (!project) notFound()
  
  const domain = (await project.domains()).find(d => d.id === params.domainid)
  if (!domain) return <NotFoundLayout
    thingName="Project Domain"
    info={`The project domain with ID "${ params.domainid }" does not exist in project "${ params.projectid }".`}
    backLabel="Back to Project"
    backHref={`/${ params.projectid }`}
  />

  return props.children

} 