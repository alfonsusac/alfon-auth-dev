import { headers } from "next/headers"

export async function setPageContext(opts: {
  searchParams: PageSearchParams,
  path: string
}) {
  const header = await headers()
  Object.assign(header, {
    __page_context: opts
  })
}
export async function getSearchParams() {
  const header = await headers()
  return (header as any).__page_context?.searchParams ?? {}
}
export async function getCurrentPath() {
  const header = await headers()
  return (header as any).__page_context?.path ?? "/"
}