import type { ReactNode } from "react"
import { getCurrentUser, type User } from "./auth"
import type { AppRoutes } from "../../.next/types/routes"
import { SuccessCallout } from "./toast/search-param-toast.client"
import { NavigationBar } from "./NavigationBar"
import { interpolatePath, type InterpolatePath } from "./interpolatePath"
import { headers } from "next/headers"
import { Spacer } from "./spacer"

export async function resolvePageProps<
  P extends PageProps<any>
>(props: P) {
  const user = await getCurrentUser()
  const params = await props.params as Awaited<P['params']>
  const searchParams = await props.searchParams as Awaited<P['searchParams']>
  return { user, searchParams, ...params }
}



type PageRoutes = AppRoutes
type PageSearchParams = Awaited<PageProps<any>['searchParams']>
type PageParams<AppRoute extends AppRoutes> = Awaited<PageProps<AppRoute>['params']>
export type AppPageContext<R extends PageRoutes> = PageParams<R> & {
  user: User | null
  searchParams: PageSearchParams,
} & {
  path: InterpolatePath<R>
}

export function page<R extends PageRoutes>(
  route: R,
  render: (context: AppPageContext<R>) => ReactNode,
) {
  return async function PageWrapper(props: PageProps<R>) {
    const context = await resolvePageProps(props)
    const path = interpolatePath<R>(route, context as PageParams<R>)
    const header = await headers()
    // Assign current context to header localasyncstorage
    Object.assign(header, { __page_context: { searchParams: context.searchParams, path } })

    try {
      return await render({ ...context, path })
    } catch (error) {
      // Improved Error System
      if (error instanceof IntentionalPageError)
        return error.render
      throw error
    }
    
  }
}

export async function searchParams() {
  const header = await headers()
  return (header as any).__page_context?.searchParams ?? {}
}
export async function currentPath() {
  const header = await headers()
  return (header as any).__page_context?.path ?? "/"
}




// Improved Error System
export class IntentionalPageError extends Error {
  constructor(readonly render: ReactNode) {
    super()
    this.name = "INTENTIONAL_PAGE_ERROR"
    this.message = "This error is intentional and used to render a specific ReactNode. If you see this message, it means the error was not caught and handled properly. Please render the 'render' property of this error instead of throwing it."
  }
}
export function notFound(render: ReactNode): never {
  const error = new IntentionalPageError(render)
  Error.captureStackTrace(error, notFound)
  throw error
}




// Base Page Template

export function Page(props: {
  children?: ReactNode,
  toasts?: Record<string, ReactNode>,
  back?: [label: string, href: `/${ string }`]
}) {
  return <>
    <SuccessCallout messages={props.toasts ?? {}} />
    {props.back && <NavigationBar back={props.back} />}
    <Spacer />
    {props.children}
  </>
}

export namespace Props {
  export type SearchParams = { searchParams: PageSearchParams }
  export type Children = { children?: ReactNode }
}