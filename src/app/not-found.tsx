import { NotFoundLayout } from "@/lib/NotFound"

export default function NotFound() {
  return <NotFoundLayout
    thingName="Page"
    info={`The page you are looking for does not exist.`}
    backLabel="Back to Home"
    backHref={`/`}
  />
}