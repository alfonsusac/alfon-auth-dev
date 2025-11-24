import { HelperText } from "../primitives"
import { DialogSurface, DialogTitle } from "./dialog.primitives"

export function Dialog(opts:
  & { children?: React.ReactNode }
  & {
    title: string,
    description?: string,
  }
  & {
    wide?: boolean
    wider?: boolean
  }
) {
  return <DialogSurface wide={opts.wide} wider={opts.wider}>
    <DialogTitle>{opts.title}</DialogTitle>
    <p className="-mt-3 mb-6 text-xs">{opts.description}</p>
    {opts.children}
  </DialogSurface>
}