import { navigateWithContext } from "@/lib/page-context/page-context-next-navigate"
import { refresh } from "next/cache"

export const navigate = {
  push:
    (path: string, ...contexts: (PageContext | undefined)[]): never =>
      navigateWithContext(path, "push", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  replace:
    (path: string, ...contexts: (PageContext | undefined)[]): never =>
      navigateWithContext(path, "replace", contexts.reduce((a, b) => ({ ...a, ...b }), {})),
  refresh:
    (...contexts: (PageContext | undefined)[]): never => {
      refresh(), navigate.replace('', ...contexts)
    },
}