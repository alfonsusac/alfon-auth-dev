import { Link } from "@/module/link"
import { Header, Title } from "@/lib/primitives"
import { homeRoute } from "../../routes"
import { authPage } from "../layout"

export default authPage('/unauthorized', async page => {
  return <>
    <Header>
      <Title>Sorry, you are unauthorized to do that :(</Title>
      <div>
        You do not have the necessary permissions to access this page or perform this action.
      </div>
    </Header>
    <Link className="button primary" href={homeRoute}>Back to Home</Link>
  </>
})