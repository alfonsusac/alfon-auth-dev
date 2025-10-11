import { Page, page } from "@/lib/page"
import { getProject } from "@/services/projects"
import { Header, Section, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import type { SVGProps } from "react"
import { Logo } from "@/shared/logot"
import { AuthorizeProjectNotFoundPage } from "./not-found"

export default page('/[projectid]/authorize', async page => {

  const { projectid } = page
  const project = await getProject(projectid)
  if (!project) return <AuthorizeProjectNotFoundPage projectid={projectid} />

  return <>
    <Page className="items-center">

    </Page>
  </>
})



