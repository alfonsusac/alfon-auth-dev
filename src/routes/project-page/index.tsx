import { DataGridDisplay } from "@/lib/DataGrid"
import { DateTime } from "@/lib/date.ui"
import { page } from "@/lib/next/next-page"
import { Header, HelperText, List, ListItem, Section, SectionTitle, Title } from "@/lib/primitives"
import { getAllProjectDomainsOfProject, getProject } from "@/services/project/db"
import { projectNotFound } from "./not-found"
import { ModalButton } from "@/lib/dialogsv2/modal.client"
import { IconAdd, IconSettings } from "@/shared/icons"
import { ProjectDomainAddModalDialog } from "./project-domain-add-dialog"
import { ProjectKeysListWithSubpages } from "./project-keys-list"
import { ProjectKeyCreateModalDialog } from "./project-key-create-dialog"
import { ProjectSettingsModal } from "./project-settings-dialog"
import { AdminOnly } from "@/shared/auth/admin-only"
import { DetailPage } from "@/lib/page-templates"
import { Modal } from "@/lib/dialogsv2/modal"
import { SubpageOverlay } from "@/lib/dialogsv2/dialog.templates"
import { ProjectDomainSubpage } from "./project-domain-subpage"
import { ProjectDomainListItem } from "./project-domains-list"
import { DialogSurface, DialogTitle } from "@/lib/dialogsv2/dialog.primitives"
import { Form } from "@/module/form"
import { addProjectDomainForm } from "./project-domain-add-form"
import { navigate } from "@/module/navigation"
import { projectPageRoute } from "../routes"
import { FormDialogButton } from "@/module/dialogs/add-dialog"
import { Dialog } from "@/lib/dialogsv2/dialog"

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
    <DetailPage toasts={toasts} back={['Home', '/']}>

      <header>
        <Title>{project.name}</Title>
        <DataGridDisplay data={{
          'project id': project.id,
          'description': project.description,
          'updated at': <DateTime date={project.updatedAt} />,
          'created at': <DateTime date={project.createdAt} />
        }} />
      </header>


      <AdminOnly>
        <Section
          title="redirect urls"
          description="these urls are authorized to redirect to after 
          authentication and also used to validate incoming requests.">
          <List
            values={getAllProjectDomainsOfProject(project.id)}
            children={domain =>
              <Modal
                key={domain.id}
                name={"domain_" + domain.id}
                button={<Modal.Button><ProjectDomainListItem domain={domain} /></Modal.Button>}
                content={modal => <SubpageOverlay><ProjectDomainSubpage context={modal.context} domain={domain} project={project} /></SubpageOverlay>} />}
          />
          <Modal
            name="add_domain"
            button={
              <Modal.Button className="button small"><IconAdd className="icon" /> Add URL</Modal.Button>}
            content={
              <Dialog
                title="Add Project URL"
                children={
                  <Form
                    form={addProjectDomainForm(project)}
                    onSuccess={async () => { "use server"; navigate.push(projectPageRoute(project.id), { success: 'domain_added' }) }} />
                } />} />
        </Section>
      </AdminOnly >


      <AdminOnly>
        <Section
          title="secret keys"
          description="you can create multiple keys for different environments (e.g. development, staging, production). 
          this will be used to validate requests to /token endpoints."
        >
          {/* <ProjectKeysListWithSubpages project={project} /> */}
          <ProjectKeyCreateModalDialog project={project}>
            <ModalButton className="button small">
              <IconAdd className="icon" /> Create Key
            </ModalButton>
          </ProjectKeyCreateModalDialog>
        </Section>
      </AdminOnly>


      <AdminOnly>
        <ProjectSettingsModal project={project} >
          <ModalButton className="button small ghost">
            <IconSettings className="icon icon-start" />
            Settings
          </ModalButton>
        </ProjectSettingsModal>
      </AdminOnly>

    </DetailPage>
  </>
})
