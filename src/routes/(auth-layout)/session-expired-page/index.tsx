import { secureRedirectString } from "@/lib/auth/redirect"
import { page } from "@/lib/page"
import { getSingleQuery } from "@/lib/page-search-params"
import { ErrorMessageHint, Header, Section, Title } from "@/lib/primitives"
import { LogInDevelopmentButton, LogInViaGoogleButton } from "@/shared/auth/login-button"
import { authPage } from "../layout"

export default authPage('/session-expired', async page => {

  const from = secureRedirectString(decodeURIComponent(getSingleQuery(page.searchParams.from)))

  return <>
    <Header>
      <Title>Your session has expired!</Title>
      <div>
        Log in back to continue your work 👀
      </div>
    </Header>
    
    <Section>
      <LogInViaGoogleButton withLogo redirectTo={from} />
      <LogInDevelopmentButton redirectTo={from} />
    </Section>

    <Section>
      <div>You will be redirected back after logging in.</div>
      <ErrorMessageHint>path: {from || '/'}</ErrorMessageHint>
    </Section>
  </>
})

// Example page:
// http://localhost:3000/session-expired?next=%2Fsome-path