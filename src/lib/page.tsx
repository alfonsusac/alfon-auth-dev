import type { ReactNode } from "react"
import { getCurrentUser, type User } from "./auth"
import type { AppRoutes } from "../../.next/types/routes"
import { SuccessCallout } from "./toast/search-param-toast.client"
import { NavigationBar } from "./NavigationBar"
import { interpolatePath, type InterpolatePath } from "./interpolatePath"

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
    return render({ ...context, path })
  }
}





export function Page(props: {
  children?: ReactNode,
  toasts?: Record<string, ReactNode>,
  back?: [label: string, href: `/${ string }`]
}) {

  return <>
    <SuccessCallout messages={props.toasts ?? {}} />
    {props.back && <NavigationBar back={props.back} />}
    {props.children}
  </>
}