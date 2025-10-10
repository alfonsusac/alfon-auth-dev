import { DataGridDisplay } from "@/lib/DataGrid"
import { DateTime } from "@/lib/date.ui"
import { Page, page } from "@/lib/page"
import { Header, HelperText, Section, SectionTitle, Title } from "@/lib/primitives"
import { getProject } from "@/services/projects"
import { projectNotFound } from "./not-found"
import { auth } from "@/lib/auth_ui"
import { ModalButton } from "@/lib/dialogsv2/modal.client"
import { IconAdd, IconSettings } from "@/lib/icons"
import { Spacer } from "@/lib/spacer"
import { ProjectDomainsList } from "./project-domains-list"
import { ProjectDomainAddModalDialog } from "./project-domain-add-dialog"
import { ProjectKeysList } from "./project-keys-list"
import { ProjectKeyCreateModalDialog } from "./project-key-create-dialog"
import { ProjectSettingsModal } from "./project-settings-dialog"

export default page('/[projectid]', async page => {

  const { projectid } = page
  const project = await getProject(projectid)
  if (!project) projectNotFound(projectid)

  const toasts = {
    new: "project created successfully!",
    key_deleted: "key deleted successfully!",
    domain_deleted: "domain deleted successfully!",
    updated: "project updated!",
  }

  return <>
    <Page toasts={toasts} back={['Home', '/']}>

      <Title>{project.name}</Title>
      <DataGridDisplay data={{
        'project id': project.id,
        'description': project.description,
        'updated at': <DateTime date={project.updatedAt} />,
        'created at': <DateTime date={project.createdAt} />
      }} />

      <auth.AdminOnly>
        <Spacer />
        <Section>
          <Header>
            <SectionTitle>redirect urls</SectionTitle>
            <HelperText>these urls are authorized to redirect to after
              authentication and also used to validate incoming requests.</HelperText>
          </Header>
          <ProjectDomainsList project={project} />
          <ProjectDomainAddModalDialog project={project}>
            <ModalButton className="button small">
              <IconAdd className="icon" /> Add URL
            </ModalButton>
          </ProjectDomainAddModalDialog>
        </Section>
      </auth.AdminOnly >

      <auth.AdminOnly>
        <Spacer />
        <Section>
          <Header>
            <SectionTitle>secret keys</SectionTitle>
            <HelperText>you can create multiple keys for different environments (e.g. development, staging, production).
              this will be used to validate requests to /token endpoints.</HelperText>
          </Header>
          <ProjectKeysList project={project} />
          <ProjectKeyCreateModalDialog project={project}>
            <ModalButton className="button small">
              <IconAdd className="icon" /> Create Key
            </ModalButton>
          </ProjectKeyCreateModalDialog>
        </Section>
      </auth.AdminOnly>

      <auth.AdminOnly>
        <Spacer />
        <ProjectSettingsModal project={project} >
          <ModalButton className="button small ghost">
            <IconSettings className="icon icon-start" />
            Settings
          </ModalButton>
        </ProjectSettingsModal>
      </auth.AdminOnly>

    </Page>
  </>
})
