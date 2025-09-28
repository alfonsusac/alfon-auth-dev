import type { ComponentProps } from "react"
import { DialogJustButtonBase, SearchParamDialog } from "../dialogs/Dialog.client"
import { DialogBackdropLink } from "../dialogs/Dialog"
import { SupPageSearchParamDialog } from "./SubpageDialog.client"

export function createSubpage(name: string, context?: PageContext) {
  // TODO - u can pass children from props instead of return components

  const SubPage =
    (props: { children?: React.ReactNode }) =>
      <SupPageSearchParamDialog name={name} context={context}>
        {props.children}
      </SupPageSearchParamDialog>


  const Button =
    (props: Omit<ComponentProps<typeof DialogJustButtonBase>, 'href' | 'context'>) =>
      <DialogJustButtonBase {...props}
        href={`?${ name }`}
        context={context}
      />

  return [SubPage, Button] as const
}