import { secureRedirectString } from "@/lib/auth/redirect"
import { Link } from "@/lib/link/link"
import { Page, page } from "@/lib/page"
import { getSingleQuery } from "@/lib/page-search-params"
import { Header, Section, Title } from "@/lib/primitives"
import { Logo } from "@/shared/logot"
import { route } from "../routes"

export default page('/unauthorized', async page => {
  return <>
    <Section>
      <Title>Sorry, you are unauthorized to do that :(</Title>
      <div>
        You do not have the necessary permissions to access this page or perform this action.
      </div>
    </Section>
    <Section>
      <Link className="button primary" href={route.home}>Back to Home</Link>
    </Section>
  </>
}, children => <>
  <Page className="justify-center self-center mb-20 items-center text-center">
    <Header className="items-center">
      <Logo />
    </Header>
    {children}
  </Page>
</>)

// TODO: Add a button to go back to the previous page or to the home page