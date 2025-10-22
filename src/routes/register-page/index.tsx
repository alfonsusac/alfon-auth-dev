import { Form } from "@/lib/formv2/form-component"
import { page } from "@/lib/page/page"
import { DetailPage } from "@/lib/page-templates"
import { Header, Row, Section, Semibold, Title } from "@/lib/primitives"
import { registerUserForm } from "./user-register-form"
import { navigate } from "@/lib/navigate"
import { route } from "../routes"
import { getCurrentUserSessionProvider } from "@/shared/auth/auth"
import { LogOutButton } from "@/shared/auth/login-button"
import { ProviderIcons } from "@/lib/auth/providers"
import { Spacer } from "@/lib/spacer"
import { obfuscateEmail } from "@/shared/obfuscated"

export default page('/register', async page => {

  const session = await getCurrentUserSessionProvider()
  if (!session) return <>
    <DetailPage back={['Home', '/']}>
      <Header>
        <Title>Unauthorized</Title>
        <p>You must be logged in to register an account.</p>
      </Header>
    </DetailPage>
  </>

  const ProviderIcon = ProviderIcons[session.provider]

  return <>
    <DetailPage back={['Home', '/']}>

      <Header>
        <Title>Register</Title>
        <p>Register your account here to continue using our services. </p>

        <Spacer sixth />
        
        <Row center className="text-xs gap-4">
          <div className="">
            <div className="text-foreground-body">logged in as</div>
            <Semibold>{obfuscateEmail(session.providerInfo.email)}</Semibold> from <Semibold><ProviderIcon className="inline align-[-0.1rem] ml-0.5" /> {session.provider}</Semibold>.
          </div>
          <LogOutButton className="small" redirectTo={'/'} />
        </Row>
      </Header>


      <Section>
        <Form
          form={registerUserForm(session)}
          onSubmit={async () => {
            "use server"
            navigate.push(route.home, { success: 'registered' })
          }}
        />
      </Section>

    </DetailPage>
  </>
})