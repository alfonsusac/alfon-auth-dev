import { Page } from "@/lib/page"
import { Header, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import { Logo } from "@/shared/logot"

export function AuthorizeProjectNotFoundPage(props: {
  projectid: string
}) {
  return (
    <Page className="justify-center self-center text-center">
      <Header className="items-center">

        <Logo />
        <div className="font-semibold tracking-tight">Alfon's Authenticator</div>

        <Spacer />

        <Title>The page you are looking for does not exist!</Title>
        <div>
          Try contacting the developer of the website for more information.
        </div>

        <Spacer />
        <div className="text-foreground-body text-xxs font-mono">
          <div className="">message to developer:</div>
          project with id "{props.projectid}" not found
        </div>
        <Spacer />
        <Spacer />

      </Header>
    </Page>
  )
}