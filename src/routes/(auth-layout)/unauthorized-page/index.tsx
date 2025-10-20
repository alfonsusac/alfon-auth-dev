import { Link } from "@/lib/link/link"
import { Header, Title } from "@/lib/primitives"
import { route } from "../../routes"
import { authPage } from "../layout"

export default authPage('/unauthorized', async page => {
  return <>
    <Header>
      <Title>Sorry, you are unauthorized to do that :(</Title>
      <div>
        You do not have the necessary permissions to access this page or perform this action.
      </div>
    </Header>
    <Link className="button primary" href={route.home}>Back to Home</Link>
  </>
})