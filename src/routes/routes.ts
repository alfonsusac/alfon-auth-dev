import { interpolatePath } from "@/lib/interpolatePath"
import type { AppRoutes, ParamMap } from "../../.next/types/routes"

// All route names should be defined here
// routes are defined by Next.js file system routing and inferred in .next/types/routes
const routeNamesMap = {
  "/": "home",
  "/[projectid]": "projectPage",
  "/[projectid]/authorize": "authorizePage",
  "/create-project": "createProjectPage",
  "/register": "registerPage",
  "/unauthorized": "unauthorizedPage",
  "/session-expired": "sessionExpiredPage",
} as const satisfies { [key in AppRoutes]: string }

export const route = {
  home: '/' as const,
  projectPage: id => `/${ id }` as const,
  authorizePage: id => `/${ id }/authorize` as const,
  createProjectPage: '/create-project' as const,
  registerPage: '/register' as const,
  unauthorizedPage: '/unauthorized' as const,
  sessionExpiredPage: '/session-expired' as const,
} satisfies { [key in RouteNames]: string | ((...args: string[]) => string) }


type RouteNameMap = typeof routeNamesMap
type RouteNames = RouteNameMap[keyof RouteNameMap]

// type GetRoutePath<N extends RouteNames> = {
//   [K in keyof RouteNameMap]: RouteNameMap[K] extends N ? K : never
// }[keyof RouteNameMap]

// type IsEmptyObject<T> = keyof T extends never ? true : false

// export function routeTo<
//   N extends RouteNameMap[keyof RouteNameMap]
// >(
//   routeName: N,
//   ...args: ParamMap[GetRoutePath<N>] extends infer P ?
//     IsEmptyObject<P> extends true ? [] : [params: P] : never
// ) {
//   const route = Object.entries(routeNamesMap).find(([, name]) => name === routeName)?.[0]
//   if (!route) throw new Error(`Route not found for name: ${ routeName }`)

//   let path = route as string
//   let argss = args as [] | [ParamMap[GetRoutePath<N>]]
//   if (argss.length === 0) return path
//   let params = argss[0]

//   // Replace dynamic segments in the path with actual values from params
//   return interpolatePath(path, params)
// }