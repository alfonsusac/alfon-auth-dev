import { DataGridDisplay } from "@/lib/DataGrid"
import { Header, HelperText, Row, Section, SectionTitle, Title } from "@/lib/primitives"
import { DomainProp, ProjectProp } from "@/routes/types"
import { DeleteButton } from "@/module/dialogs/dialog-delete"
import { EditFormDialogButton } from "@/module/dialogs/dialog-edit"
import { CodeBlock } from "@/lib/code-block/code-blocks"
import { DetailPage } from "@/lib/page-templates"
import { isError } from "@/module/action/error"
import { resolveAction } from "@/module/action/action"
import { Link } from "@/module/link"
import { authorizePageRoute, projectPageRoute } from "../routes"
import { updateProjectDomainForm } from "@/services/project-domain/forms"
import { bindAction } from "@/lib/core/action"
import { deleteProjectDomainAction } from "@/services/project-domain/actions"


export async function ProjectDomainSubpage({ project, domain, context }:
  & ProjectProp
  & DomainProp
  & PageContextProp
) {

  return <DetailPage className="max-w-none" toasts={{
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
        <EditFormDialogButton
          name={'Domain'}
          context={context}
          form={updateProjectDomainForm(domain)({ project_id: project.id })}
          extend={{
            origin: { defaultValue: domain.origin },
            redirect_url: { defaultValue: domain.redirect_url.replace(domain.origin, '') }
          }}
          onSuccess={async () => { "use server"; resolveAction.success('replace', projectPageRoute(project.id), 'updated', context) }}
        />
        <DeleteButton
          name={`domain-${ domain.id }`}
          context={context}
          label="Delete Project Domain"
          alertTitle="Are you sure you want to permanently delete this domain?"
          alertDescription="This action cannot be undone. Any applications using this domain will no longer be able to access the project."
          action={bindAction(deleteProjectDomainAction, domain.id)}
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
        href={authorizePageRoute(project.id)} _blank
        context={{
          redirect_uri: domain.redirect_url,
          code: "S256_example_code_challenge",
          next: projectPageRoute(project.id)
        }}
        className="button small primary"
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
  + '?redirect_uri=${ domain.redirect_url }'
  + \`&code=\${ code_challenge }\`
  + \`&next=\${ next_path }\`
)
          `}
      />
    </Section>
  </DetailPage>

}