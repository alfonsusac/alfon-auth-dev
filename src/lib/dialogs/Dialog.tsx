import type { ComponentProps } from "react"
import { Link } from "../link/Link"
import { cn } from "lazy-cn"

export function DialogButton(props: {
  name: string,
  label: React.ReactNode,
  children?: React.ReactNode,
  searchParams: Awaited<PageProps<any>['searchParams']>,
}) {
  const sp = props.searchParams

  return <>
    <Link
      className="button destructive small"
      href={`?${ props.name }=show`} scroll={false}
    >
      {props.label}
    </Link>

    {sp[props.name] === 'show' &&
      <div className="fixed top-0 left-0 w-screen h-screen z-(--z-dialog)">
        <Link className="absolute top-0 left-0 w-full h-full bg-foreground/25 animate-dialog-in" href={"?"} replace scroll={false} />
        {props.children}
      </div>}
  </>
}

export function DialogPaper(props: ComponentProps<"div">) {
  return <div {...props} className={cn("absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-80", props.className)} />
}
