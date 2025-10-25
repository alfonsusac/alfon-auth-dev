import { toNativeSearchParams } from "@/lib/next/next-search-params"
import type { AppRoutes } from "../../.next/dev/types/routes"

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
  "/not-registered": "notRegisteredPage",
  "/test-navigate": "testNavigatePage",
  '/test-response': 'testResponsePage',
} as const satisfies { [key in AppRoutes]: string }

export const route = {
  home: '/' as const,
  projectPage: id => `/${ id }` as const,
  authorizePage: id => `/${ id }/authorize` as const,
  createProjectPage: '/create-project' as const,
  registerPage: '/register' as const,
  unauthorizedPage: '/unauthorized' as const,
  sessionExpiredPage: '/session-expired' as const,
  notRegisteredPage: '/not-registered' as const,
  testNavigatePage: '/test-navigate' as const,
  testResponsePage: '/test-response' as const,
} satisfies { [key in RouteNames]: string | ((...args: string[]) => string) }


type RouteNameMap = typeof routeNamesMap
type RouteNames = RouteNameMap[keyof RouteNameMap]

export function withContext(route: `/${ string }`, context: { [key: string]: string | undefined }) {
  if (!context) return route
  if (Object.keys(context).length === 0) return route
  const sp = toNativeSearchParams(context)
  return (route + (sp.toString() ? '?' + sp.toString() : '')) as `/${ string }`
}
