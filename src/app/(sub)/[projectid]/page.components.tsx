import { NotFoundLayout } from "@/lib/NotFound"

export function projectNotFound(projectid: string) {
  return <NotFoundLayout
    thingName="Project"
    info={`The project with ID "${ projectid }" does not exist.`}
    backLabel="Back to Home"
    backHref="/"
  />
}