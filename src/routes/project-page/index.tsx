import { DataGridDisplay } from "@/lib/DataGrid"
import { DateTime } from "@/lib/date.ui"
import { page } from "@/lib/next/next-page"
import { List, ListItem, Section, Title } from "@/lib/primitives"
import { getAllProjectDomainsOfProject, getAllProjectKeysByProjectID, getProject } from "@/services/project/db"
import { projectNotFound } from "./not-found"
import { IconAdd, IconSettings } from "@/shared/icons"
import { AdminOnly } from "@/shared/auth/admin-only"
import { DetailPage } from "@/lib/page-templates"
import { Modal } from "@/lib/dialogsv2/modal"
import { SubpageOverlay } from "@/lib/dialogsv2/dialog.templates"
import { ProjectDomainSubpage } from "./project-domain-subpage"
import { navigate } from "@/module/navigation"
import { projectPageRoute } from "../routes"
import { Dialog } from "@/lib/dialogsv2/dialog"
import { ProjectKeySubpage } from "./project-key-subpage"
import type { ComponentProps } from "react"
import type { DomainProp, ProjectKeyProp } from "../types"
import { Button } from "@/module/button"
import { deleteProjectAction } from "@/services/project/actions"
import { DeleteButton } from "@/module/dialogs/dialog-delete"
import { Form } from "@/module/form"
import { bindAction } from "@/lib/core/action"
import { createProjectKeyForm } from "@/services/project-key/forms"
import { addProjectDomainForm } from "@/services/project-domain/forms"
import { updateProjectForm } from "@/services/project/forms"

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
            fallback="No URLs present"
            children={domain =>
              <Modal
                key={domain.id}
                name={"domain_" + domain.id}
                button={
                  <ProjectDomainListItem domain={domain} />}
                content={modal =>
                  <SubpageOverlay children={<ProjectDomainSubpage context={modal.context} domain={domain} project={project} />} />} />}
          />
          <Modal
            name="add_domain"
            button={
              <Button using={Modal.Trigger} icon={IconAdd} className="small">Add URL</Button>}
            content={
              <Dialog wide
                title="Add Project URL"
                children={
                  <Form
                    form={addProjectDomainForm({ project_id: project.id })}
                    onSuccess={async () => { "use server"; navigate.push(projectPageRoute(project.id), { success: 'domain_added' }) }} />} />} />
        </Section>
      </AdminOnly >


      <AdminOnly>
        <Section
          title="secret keys"
          description="you can create multiple keys for different environments (e.g. development, staging, production). 
          this will be used to validate requests to /token endpoints."
        >
          <List
            values={getAllProjectKeysByProjectID(project.id)}
            fallback="No API keys present"
            children={key =>
              <Modal
                key={key.id}
                name={"key_" + key.id}
                button={
                  <ProjectKeyLIteItem projectKey={key} />}
                content={modal =>
                  <SubpageOverlay>
                    <ProjectKeySubpage context={modal.context} project={project} projectKey={key} />
                  </SubpageOverlay>} />
            }
          />
          <Modal
            name="create_key"
            button={
              <Button className="small" using={Modal.Trigger} icon={IconAdd}>Create Key</Button>}
            content={
              <Dialog wide
                title="Create Secret Key"
                description="Project keys are used to authorize your application to use the authentication services."
                children={<Form
                  form={createProjectKeyForm({ project_id: project.id })}
                  onSuccess={async () => {
                    "use server"
                    navigate.push(projectPageRoute(project.id), { success: 'key_added' })
                  }}
                />}
              />
            }
          />
        </Section>
      </AdminOnly>

      <AdminOnly>
        <Modal
          name={`project_setting`}
          button={<Button using="div" icon={IconSettings}>Settings</Button>}
          content={modal =>
            <Dialog wider title="Project Settings">
              <Section
                title="project details"
                children={
                  <Form
                    form={updateProjectForm(project.id)()}
                    onSuccess={async () => {
                      "use server"
                      navigate.replace(projectPageRoute(project.id), { success: "updated" }, modal.context)
                    }}
                  />
                }
              />
              <Section
                title="danger zone"
                children={
                  <DeleteButton
                    context={modal.context}
                    name={`project-${ project.id }`}
                    what="Project"
                    alertDescription="This action cannot be undone. All associated data, including users and keys, will be permanently removed."
                    action={bindAction(deleteProjectAction, project.id)}
                  />
                }
              />
            </Dialog>
          }
        />
        {/* <ProjectSettingsModal project={project} > */}
        {/* <ModalButton className="button small ghost">
            <IconSettings className="icon icon-start" />
            Settings
          </ModalButton> */}
        {/* </ProjectSettingsModal> */}
      </AdminOnly>

    </DetailPage >
  </>
})



function ProjectDomainListItem({ domain, ...rest }:
  & ComponentProps<'div'>
  & DomainProp
) {
  const protocol = domain.redirect_url.startsWith('https://') ? 'https://' : 'http://'
  const origin = new URL(domain.redirect_url)?.origin.replace('http://', '').replace('https://', '')

  return <>
    <ListItem className="text-foreground-body/75 leading-3 text-[0.813rem]" {...rest}>
      <span className="text-foreground-body/50">{protocol}</span>
      <span className="font-medium text-foreground">{origin}</span>
      <span>{domain.redirect_url.replace(domain.origin, '')}</span>
    </ListItem>
  </>
}

function ProjectKeyLIteItem({ projectKey, ...rest }:
  & ComponentProps<'div'>
  & ProjectKeyProp
) {
  const key = projectKey
  return <>
    <ListItem>
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
    </ListItem>
  </>
}