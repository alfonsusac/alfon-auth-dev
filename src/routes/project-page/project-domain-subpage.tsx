import { DataGridDisplay } from "@/lib/DataGrid"
import { Header, HelperText, Row, Section, SectionTitle, Title } from "@/lib/primitives"
import { actionResolveError } from "@/lib/redirects"
import { navigate } from "@/lib/resolveAction"
import { DomainProp, ProjectProp } from "@/routes/types"
import { DeleteButton } from "@/shared/dialog-delete"
import { deleteDomainAction } from "./project-domain-delete-action"
import { Form } from "@/lib/formv2/form-component"
import { editProjectDomainForm } from "./project-domain-edit-form"
import { route } from "../routes"
import { Page } from "@/lib/page"
import { EditFormDialog } from "@/shared/dialog-edit"
import { Link } from "@/lib/link/link"
import { CodeBlock } from "@/lib/code-block/code-blocks"


export async function ProjectDomainSubpage({ project, domain, context }:
  & ProjectProp
  & DomainProp
  & PageContextProp
) {

  return <Page className="max-w-none" toasts={{
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
      <Row>
        <EditFormDialog
          name={'Domain'}
          context={context}
        >
          {() => <>
            <Form
              form={editProjectDomainForm({ project, domain })}
              onSubmit={async () => {
                "use server"
                navigate.replace(route.projectPage(project.id), { success: 'updated' }, context)
              }}
            />
          </>}
        </EditFormDialog>
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
      </Row>
    </Header>

    <Section>
      <Header>
        <SectionTitle>Integration</SectionTitle>
        <HelperText>
          You can now use this domain in your OAuth2/OpenID Connect integration.
          Below is the authorization URL you can use to initiate the authorization flow.
        </HelperText>
      </Header>
      <Link
        href={route.authorizePage(project.id)}
        className="button small primary"
        target="_blank"
      >
        Go to Authorization Page
      </Link>
    </Section>

    <Section>
      <Header>
        <SectionTitle>API Reference</SectionTitle>
        <HelperText>
          These are the required parameters to include in your authorization requests.
        </HelperText>
      </Header>
      <CodeBlock
        code={`
redirect('${ process.env.BASE_URL }/${ project.id }/authorize'
  + '?redirect_uri=' + '${ domain.redirect_url }'
)
          `}
      />

    </Section>


  </Page>

}