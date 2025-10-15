import { CodeMessageHint, Header, Row, Section, Title } from "@/lib/primitives"
import { authPage } from "../layout"
import { Link } from "@/lib/link/link"
import { IconRight } from "@/shared/icons"
import { getFromPath } from "../session-expired-page/interface"

export default authPage('/not-registered', async page => {

  const { from } = getFromPath(page.searchParams)

  return <>
    <Header>
      <Title>
        You do not have an account yet.
      </Title>
      <div>
        Do you want to create an account for alfon.dev?
      </div>
    </Header>

    <Row>
      <Link className="button px-8" href="/register">No</Link>
      <Link className="button primary" href="/register" context={from ? { from } : undefined}>Register an account <IconRight /></Link>
    </Row>
  </>
})