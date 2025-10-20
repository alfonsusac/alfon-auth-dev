import type { ReactNode } from "react"
import { interpolatePath, type InterpolatePath } from "./interpolatePath"
import { headers } from "next/headers"
import { UnauthorizedLayout } from "./NotFound"
import { resolveCustomRedirectError } from "./navigate"
import { redirect, RedirectType } from "next/navigation"
import { getUser, type User } from "@/shared/auth/auth"
import { fromPageSearchParamsToString } from "./searchParams"
import type { AppRoutes } from "../../.next/dev/types/routes"

export async function resolvePageProps<
  P extends PageProps<any>
>(props: P) {
  const user = await getUser()
  const params = await props.params as Awaited<P['params']>
  const searchParams = await props.searchParams as Awaited<P['searchParams']>
  return { user, searchParams, ...params }
}



export type PageRoutes = AppRoutes
type PageSearchParams = Awaited<PageProps<any>['searchParams']>
type PageParams<AppRoute extends AppRoutes> = Awaited<PageProps<AppRoute>['params']>
export type AppPageContext<R extends PageRoutes> = PageParams<R> & {
  user: User | null
  searchParams: PageSearchParams,
} & {
  path: InterpolatePath<R>
  pathQuery: string
}

export function page<R extends PageRoutes>(
  route: R,
  render: (context: AppPageContext<R>) => ReactNode,
  layout?: (children?: ReactNode) => ReactNode,
) {
  const Page = async function PageWrapper(props: PageProps<R>) {
    const pageProps = await resolvePageProps(props)
    const path = interpolatePath<R>(route, pageProps as PageParams<R>)
    const pathQuery = path + fromPageSearchParamsToString(pageProps.searchParams)
    const context = { ...pageProps, path, pathQuery }
    
    // Assign current context to header localasyncstorage
    const header = await headers()
    Object.assign(header, { __page_context: { searchParams: pageProps.searchParams, path } })

    try {
      if (layout) {
        return layout(await render(context))
      }
      return await render(context)
    } catch (error) {
      const redirection = resolveCustomRedirectError(error)
      if (redirection) {
        if (redirection.mode === "replace")
          redirect(redirection.path, RedirectType.push)
        if (redirection.mode === "push")
          redirect(redirection.path, RedirectType.replace)
      }
      // Improved Error System
      if (error instanceof IntentionalPageError)
        return error.render
      throw error
    }
  }
  const Route = (param: PageParams<R>) => {
    const path = interpolatePath<R>(route, param)
    return path
  }

  return {
    Page,
    Route,
    $context: null as unknown as AppPageContext<R>
  }
}


// Helper Types and Functions

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
export function unauthorized(backLabel: string, backHref: `/${ string }`): never {
  const error = new IntentionalPageError(<UnauthorizedLayout backLabel={backLabel} backHref={backHref} />)
  Error.captureStackTrace(error, unauthorized)
  throw error
}





export namespace Props {
  export type SearchParams = { searchParams: PageSearchParams }
  export type Children = { children?: ReactNode }
}

