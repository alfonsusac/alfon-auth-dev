export function NotFoundLayout(props: {
  title: string,
  info: string,
  backLabel: string,
  backHref: string,
}) {
  return <>
    <section>
      <h1 className="page-h1">{props.title}</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        {props.info}
      </p>
    </section>

    <a href={props.backHref} className="button primary">{'<-'} {props.backLabel}</a>
  </>
}