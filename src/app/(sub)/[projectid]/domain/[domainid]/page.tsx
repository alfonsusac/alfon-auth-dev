import { actionAdminOnly } from "@/lib/auth"

export default async function ProjectDomainPage(props: PageProps<'/[projectid]/domain/[domainid]'>) {
  const params = await props.params
  const projectid = params.projectid
  await actionAdminOnly(`/${ projectid }`)



  
  
} 