import { secureRedirectString } from "@/lib/auth/redirect"
import { Page, page } from "@/lib/page"
import { getSingleQuery } from "@/lib/page-search-params"
import { Header, Section, Title } from "@/lib/primitives"
import { Logo } from "@/shared/logot"

export default page('/unauthorized', async page => {

  const next_url = secureRedirectString(decodeURIComponent(getSingleQuery(page.searchParams.next)))

  return <>
    <Section>
      <Title>You are unauthorized to do that!</Title>
      <div></div>
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