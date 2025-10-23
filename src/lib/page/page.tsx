import type { ReactNode } from "react"
import { getUser } from "@/shared/auth/auth"
import type { AppRoutes } from "@/../.next/dev/types/routes"
import { interpolatePath } from "../interpolatePath"
import { UnauthorizedLayout } from "../NotFound"
import { fromPageSearchParamsToString } from "../searchParams"
import { resolveNextPageProps } from "../next/next-page-props"
import { getCurrentPath, getSearchParams, setPageContext } from "../next/next-page-better-context"
import { throwRedirectIfNextBetterRedirectErrorAtServer } from "../next/next-better-redirects"


export type PageRoutes = AppRoutes



async function getPageRouteContext<R extends PageRoutes>(props: PageProps<R>, route: R) {
  const pageProps = await resolveNextPageProps(props)
  const user = await getUser()
  const path = interpolatePath(route, pageProps.params)
  const pathQuery = path + fromPageSearchParamsToString(pageProps.searchParams)
  const context = { ...pageProps, path, pathQuery, user, ...pageProps.params }
  return context
}
export type PageRouteContext<R extends PageRoutes> = Awaited<ReturnType<typeof getPageRouteContext<R>>>



export function page<R extends PageRoutes>(
  route: R,
  render: (context: PageRouteContext<R>) => ReactNode,
  layout?: (children?: ReactNode) => ReactNode,
) {
  const Page = async function PageWrapper(props: PageProps<R>) {

    const context = await getPageRouteContext(props, route) as PageRouteContext<R>
    await setPageContext(context)

    try {

      if (layout) 
        return layout(await render(context))
      return await render(context)

    } catch (error) {

      if (error instanceof IntentionalPageError) // Improved Error System
        return error.render
      
      throwRedirectIfNextBetterRedirectErrorAtServer(error)

      throw error
      
    }
  }
  return {
    Page,
    $context: null as unknown as PageRouteContext<R>
  }
}


export async function searchParams() {
  return getSearchParams()
}
export async function currentPath() {
  return getCurrentPath()
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

