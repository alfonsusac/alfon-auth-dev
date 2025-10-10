import { Link } from "./link/link"
import { Spacer } from "./spacer"

export function NotFoundLayout(props: {
  thingName: string,
  info: string,
  backLabel: string,
  backHref: string,
}) {
  return <>
    <section>
      <p
        className="mb-2 text-6xl text-foreground-body/20 font-black inline-block mask-linear-from-20% mask-linear-to-120% mask-linear-180 mask-linear-to-black/25"
      >
        404
      </p>
      <h1 className="page-h1">Sorry, {props.thingName} Not Found.</h1>
      <p className="text-pretty text-sm max-w-120 text-foreground-body/80 mt-2">
        {props.info}
      </p>
    </section>
    <Spacer />
    <Link href={props.backHref} className="button primary">{'<-'} {props.backLabel}</Link>
  </>
}


export function UnauthorizedLayout(props: {
  backLabel: string,
  backHref: string,
}) {
  return <>
    <section>
      <p
        className="mb-2 text-6xl text-foreground-body/20 font-black inline-block mask-linear-from-20% mask-linear-to-120% mask-linear-180 mask-linear-to-black/25"
      >
        401
      </p>
      <h1 className="page-h1">Sorry, u're unauthorised</h1>
      <p className="text-pretty text-sm max-w-120 text-foreground-body/80 mt-2">
        You're not authorised to view this resource.
      </p>
    </section>
    <Spacer />
    <Link href={props.backHref} className="button primary">{'<-'} {props.backLabel}</Link>
  </>
}