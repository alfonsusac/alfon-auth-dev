import { NotFoundLayout } from "@/lib/NotFound"

export function ProjectNotFound(props: { id: string }) {
  return <NotFoundLayout
    title="Project Not Found"
    info={`The project with ID "${ props.id }" does not exist.`}
    backLabel="Back to Home"
    backHref="/"
  />
}

export function ProjectKeyNotFound(props: { key_id: string, project_id: string }) {
  return <NotFoundLayout
    title="Project Key Not Found"
    info={`The project key with ID "${ props.key_id }" does not exist in project "${ props.project_id }".`}
    backLabel="Back to Project"
    backHref={`/${ props.project_id }`}
  />
}