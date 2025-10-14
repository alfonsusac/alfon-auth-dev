import { Link } from "@/lib/link/link"
import { page } from "@/lib/page"
import { Section, Title } from "@/lib/primitives"
import { route } from "../routes"
import { AuthPage } from "@/lib/page-templates"

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
}, children => <AuthPage>{children}</AuthPage>
)

// TODO: Add a button to go back to the previous page or to the home page