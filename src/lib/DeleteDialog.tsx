import { DeleteAlert, DeleteAlert2 } from "./DeleteAlert"
import { Link } from "./Link"

export function DeleteDialogButton(props: {
  label: string,
  searchParams: Awaited<PageProps<any>['searchParams']>,
  alertTitle?: string,
  alertDescription?: string,
  alertActionLabel?: string,
  action: () => Promise<void>,
}) {
  const sp = props.searchParams

  return <>
    <Link className="button destructive small"
      href={`?delete=show`} replace scroll={false}>
      {props.label}
    </Link>

    {sp.delete === 'show' && <div className="fixed top-0 left-0 w-screen h-screen">
      <Link className="absolute top-0 left-0 w-full h-full bg-foreground/25 animate-dialog-in" href={"?"} replace scroll={false} />
      <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-6 bg-background rounded-xl shadow-2xl w-full max-w-80">
        <DeleteAlert2
          title={props.alertTitle || `Are you sure you want to permanently delete this item?`}
          description={props.alertDescription || "This action cannot be undone."}
          backHref={'?'}
          actionLabel="Delete"
          action={props.action}
        />
      </div>
    </div>}

  </>
}