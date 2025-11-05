import { SubpageOverlay } from "@/lib/dialogsv2/dialog.templates"
import { Modal } from "@/lib/dialogsv2/modal"
import { List } from "@/lib/primitives"
import { ProjectProp, DomainProp } from "@/routes/types"
import { getAllProjectDomainsOfProject } from "@/services/ project/db"
import { ProjectDomainSubpage } from "./project-domain-subpage"

export async function ProjectDomainsList({ project }: & ProjectProp) {
  const domains = await getAllProjectDomainsOfProject(project.id)
  return <>
    <List val={domains}>
      {domain => <ProjectDomainsListItem key={domain.id} domain={domain} project={project} />}
    </List>
  </>
}


function ProjectDomainsListItem({ domain, project }: & DomainProp & ProjectProp) {

  const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
  const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')

  return <>
    <li className="relative group" key={domain.id}>
      <Modal
        name={"domain_" + domain.id}
        button={Button => <>
          <Button className="list-row text-foreground-body/75 leading-3 text-[0.813rem]">
            <span className="text-foreground-body/50">{protocol}</span>
            <span className="font-medium text-foreground">{origin}</span>
            <span>{domain.redirect_url.replace(domain.origin, '')}</span>
          </Button>
        </>}
        content={modal => <>
          <SubpageOverlay>
            <ProjectDomainSubpage context={modal.context} domain={domain} project={project} />
          </SubpageOverlay>
        </>}
      />
    </li>
  </>

}