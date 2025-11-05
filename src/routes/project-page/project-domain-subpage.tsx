import { DataGridDisplay } from "@/lib/DataGrid"
import { Header, HelperText, Row, Section, SectionTitle, Title } from "@/lib/primitives"
import { DomainProp, ProjectProp } from "@/routes/types"
import { DeleteButton } from "@/shared/dialog-delete"
import { deleteDomainAction } from "./project-domain-delete-action"
import { Form } from "@/module/form"
import { editProjectDomainForm } from "./project-domain-edit-form"
import { EditFormDialog } from "@/shared/dialog-edit"
import { CodeBlock } from "@/lib/code-block/code-blocks"
import { DetailPage } from "@/lib/page-templates"
import { isError } from "@/module/action/error"
import { action } from "@/module/action/action"
import { Link } from "@/module/link"
import { authorizePageRoute, projectPageRoute } from "../routes"


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
        <EditFormDialog
          name={'Domain'}
          context={context}
        >
          {() => <>
            <Form
              form={editProjectDomainForm({ project, domain })}
              context={context}
              onSuccess={async () => {
                "use server"
                action.success('replace', projectPageRoute(project.id), 'updated', context)
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
            if (isError(res)) action.error(res, context)
            action.success('replace', projectPageRoute(project.id), 'domain_deleted')
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