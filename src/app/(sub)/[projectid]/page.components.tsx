import { NotFoundLayout } from "@/lib/NotFound"
import { notFound } from "@/lib/page"

export function projectNotFound(projectid: string): never {
  // return <NotFoundLayout
  //   thingName="Project"
  //   info={`The project with ID "${ projectid }" does not exist.`}
  //   backLabel="Back to Home"
  //   backHref="/"
  // />
  notFound(<NotFoundLayout
    thingName="Project"
    info={`The project with ID "${ projectid }" does not exist.`}
    backLabel="Back to Home"
    backHref="/"
  />)
}
