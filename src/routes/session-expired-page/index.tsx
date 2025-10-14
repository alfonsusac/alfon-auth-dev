import { secureRedirectString } from "@/lib/auth/redirect"
import { page } from "@/lib/page"
import { getSingleQuery } from "@/lib/page-search-params"
import { DetailPage } from "@/lib/page-templates"
import { ErrorMessageHint, Header, Section, Title } from "@/lib/primitives"
import { LogInDevelopmentButton, LogInViaGoogleButton } from "@/shared/auth/login-button"
import { Logo } from "@/shared/logot"

export default page('/session-expired', async page => {

  const from = secureRedirectString(decodeURIComponent(getSingleQuery(page.searchParams.from)))

  return <>
    <Section>
      <Title>Your session has expired!</Title>
      <div>
        Log in back to continue your work 👀
      </div>
    </Section>
    <Section>
      <LogInViaGoogleButton withLogo redirectTo={from} />
      <LogInDevelopmentButton redirectTo={from} />
    </Section>
    <Section>
      <div>You will be redirected back after logging in.</div>
      <ErrorMessageHint>path: {from || '/'}</ErrorMessageHint>
    </Section>
  </>
}, children => <>
  <DetailPage className="justify-center self-center mb-20 items-center text-center">
    <Header className="items-center">
      <Logo />
    </Header>
    {children}
  </DetailPage>
</>)

// Example page:
// http://localhost:3000/session-expired?next=%2Fsome-path