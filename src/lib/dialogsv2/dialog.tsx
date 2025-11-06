import { DialogSurface, DialogTitle } from "./dialog.primitives"

export function Dialog(opts: {
  title: string,
  children?: React.ReactNode
  wide?: boolean
}) {
  return <DialogSurface wide={opts.wide}>
    <DialogTitle>{opts.title}</DialogTitle>
    {opts.children}
  </DialogSurface>
}