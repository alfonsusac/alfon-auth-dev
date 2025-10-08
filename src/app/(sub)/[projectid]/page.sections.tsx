import { SubpageOverlay } from "@/lib/dialogsv2/dialog.templates"
import { Modal } from "@/lib/dialogsv2/modal"
import { ModalButton } from "@/lib/dialogsv2/modal.client"
import { List } from "@/lib/primitives"
import { getAllProjectDomainsOfProject, getAllProjectKeysByProjectID } from "@/services/projects"
import { type ProjectProp } from "./page"
import type { Props } from "@/lib/page"
import { CopyButton } from "@/lib/CopyButton"
import { DateTime } from "@/lib/date.ui"
import { SubPage } from "@/lib/dialogs/dialog-subpage"
import { ProjectDomainSubpage, ProjectKeySubpage } from "./page.subpages"

export async function ProjectDomainsList({ project, searchParams }:
  & ProjectProp
  & Props.SearchParams
) {
  const domains = await getAllProjectDomainsOfProject(project.id)

  return (
    <List val={domains}>{domain => {
      const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
      const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')
      return <li className="relative group" key={domain.id}>
        <Modal name={"domain_" + domain.id}>
          {modal => <>
            <ModalButton className="list-row text-foreground-body/75 leading-3 text-[0.813rem]">
              <span className="text-foreground-body/50">{protocol}</span>
              <span className="font-medium text-foreground">{origin}</span>
              <span>{domain.redirect_url.replace(domain.origin, '')}</span>
            </ModalButton>

            <SubpageOverlay>
              <ProjectDomainSubpage
                context={modal.context}
                domainid={domain.id}
                projectid={project.id}
                searchParams={searchParams}
              />
            </SubpageOverlay>
          </>}
        </Modal>
      </li>
    }}</List>
  )
}

export async function ProjectKeysList({ project, searchParams }:
  & ProjectProp
  & Props.SearchParams
) {
  const project_keys = await getAllProjectKeysByProjectID(project.id)

  return (
    <List val={project_keys} fallback="No API keys present">
      {key =>
        <li className="relative group" key={key.id}>
          <SubPage name={`key_${ key.id }`} children={subpage => <>
            <subpage.Button>
              <button className="list-row">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="text-foreground-body font-semibold leading-3 text-xs">
                    🔑 {key.name}
                    <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                      {' - '}<DateTime date={key.createdAt} />
                    </span>
                  </div>
                  <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0">
                    {key.client_secret}
                  </div>
                </div>
              </button>
            </subpage.Button>

            <subpage.Content>
              <ProjectKeySubpage
                context={{ [`key_${ key.id }`]: '' }}
                keyid={key.id}
                projectid={project.id}
                searchParams={searchParams ?? {}}
              />
            </subpage.Content>
          </>} />


          <div className="absolute top-1 right-1">
            <CopyButton text={key.client_secret} className="button small floating opacity-0 group-hover:opacity-100">
              copy
            </CopyButton>
          </div>
        </li>
      }
    </List>
  )
}



