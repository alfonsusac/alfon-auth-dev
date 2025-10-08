import { getProject, type Project } from "@/services/projects"
import { AUTH } from "@/lib/auth_ui"
import { DataGridDisplay } from "@/lib/DataGrid"
import { IconAdd, IconSettings } from "@/lib/icons"
import { DateTime } from "@/lib/date.ui"
import { Page, page } from "@/lib/page"
import { ModalButton } from "@/lib/dialogsv2/modal.client"
import { projectNotFound } from "./page.components"
import { ProjectDomainAddModalDialog, ProjectKeyCreateModalDialog, ProjectSettingsModal } from "./page.interactions"
import { Spacer } from "@/lib/spacer"
import { Header, HelperText, Section, SectionTitle, Title } from "@/lib/primitives"
import { ProjectDomainsList, ProjectKeysList } from "./page.sections"

export type ProjectProp = { project: Project }

export default page('/[projectid]', async page => {

  const { projectid, searchParams } = page
  const project = await getProject(projectid)
  if (!project) projectNotFound(projectid)

  return <Page toasts={{
    new: "project created successfully!",
    key_deleted: "key deleted successfully!",
    domain_deleted: "domain deleted successfully!",
    updated: "project updated!",
  }} back={['Home', '/']}>

    <Title>{project.name}</Title>
    <DataGridDisplay data={{
      'project id': project.id,
      'description': project.description,
      'updated at': <DateTime date={project.updatedAt} />,
      'created at': <DateTime date={project.createdAt} />
    }} />

    <AUTH.AdminOnly>
      <Spacer />
      <Section>
        <Header>
          <SectionTitle>redirect urls</SectionTitle>
          <HelperText>these urls are authorized to redirect to after
            authentication and also used to validate incoming requests.</HelperText>
        </Header>
        <ProjectDomainsList project={project} searchParams={searchParams} />
        <ProjectDomainAddModalDialog project={project} searchParams={searchParams}>
          <ModalButton className="button small">
            <IconAdd className="icon" /> Add URL
          </ModalButton>
        </ProjectDomainAddModalDialog>
      </Section>
    </AUTH.AdminOnly >

    <AUTH.AdminOnly>
      <Spacer />
      <Section>
        <Header>
          <SectionTitle>secret keys</SectionTitle>
          <HelperText>you can create multiple keys for different environments (e.g. development, staging, production).
            this will be used to validate requests to /token endpoints.</HelperText>
        </Header>
        <ProjectKeysList project={project} searchParams={searchParams} />
        <ProjectKeyCreateModalDialog project={project} searchParams={searchParams}>
          <ModalButton className="button small">
            <IconAdd className="icon" /> Create Key
          </ModalButton>
        </ProjectKeyCreateModalDialog>
      </Section>
    </AUTH.AdminOnly>

    <AUTH.AdminOnly>
      <Spacer />
      <ProjectSettingsModal project={project} searchParams={searchParams} >
        <ModalButton className="button small ghost">
          <IconSettings className="icon icon-start" />
          Settings
        </ModalButton>
      </ProjectSettingsModal>
    </AUTH.AdminOnly>

  </Page >
})


















