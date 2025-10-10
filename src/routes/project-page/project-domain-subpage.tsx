import { DataGridDisplay } from "@/lib/DataGrid"
import { Header, Section, Title } from "@/lib/primitives"
import { actionResolveError } from "@/lib/redirects"
import { navigate } from "@/lib/resolveAction"
import { SuccessCallout } from "@/lib/toast/search-param-toast.client"
import { DomainProp, ProjectProp } from "@/routes/types"
import { DeleteButton } from "@/shared/dialog-delete"
import { deleteDomainAction } from "./project-domain-delete-action"
import { Form } from "@/lib/formv2/form-component"
import { editProjectDomainForm } from "./project-domain-edit-form"
import { route } from "../routes"
import { Page } from "@/lib/page"


export async function ProjectDomainSubpage({ project, domain, context }:
  & ProjectProp
  & DomainProp
  & PageContextProp
) {

  return <Page toasts={{
    'domain_deleted': "domain deleted successfully!",
    'updated': "domain updated!"
  }}>
    <Header>
      <Title>{domain.origin}</Title>
      <DataGridDisplay data={{
        'redirect url': domain.redirect_url,
        'created at': new Date(domain.createdAt),
        'updated at': new Date(domain.updatedAt)
      }} />
    </Header>

    <Section>
      <Form
        form={editProjectDomainForm({ project, domain })}
        onSubmit={async () => {
          "use server"
          navigate.replace(route.projectPage(project.id), { success: 'updated' }, context)
        }}
      />
      <DeleteButton
        name={`domain-${ domain.id }`}
        context={context}

        label="Delete Project Domain"
        alertTitle="Are you sure you want to permanently delete this domain?"
        alertDescription="This action cannot be undone. Any applications using this domain will no longer be able to access the project."
        action={async () => {
          "use server"
          const res = await deleteDomainAction(domain.id)
          actionResolveError(res, { delete: 'show' })
          navigate.replace(route.projectPage(project.id), { success: 'domain_deleted' })
        }}
      />
    </Section>



  </Page>

}