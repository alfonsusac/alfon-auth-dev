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
  '/test-form': 'testFormPage',
} as const satisfies { [key in AppRoutes]: string }

export function withContext(route: `/${ string }`, ...context: { [key: string]: string | undefined }[]) {
  if (!context) return route
  if (Object.keys(context).length === 0) return route
  const mergedContext = Object.assign({}, ...context)
  const sp = toNativeSearchParams(mergedContext)
  return (route + (sp.toString() ? '?' + sp.toString() : '')) as `/${ string }`
}

function createRouteWithContext(route: `/${ string }`) {
  return route
  // return (...context: { [key: string]: string | undefined }[]) => withContext(route, ...context)
}

export type routeNames = typeof routeNamesMap[keyof typeof routeNamesMap] 

// navigate.push('registerPage(asdfas)?success:project_created') 

export const homeRoute = createRouteWithContext('/')
export const projectPageRoute = (id: string) => createRouteWithContext(`/${ id }`)
export const authorizePageRoute = (id: string) => createRouteWithContext(`/${ id }/authorize`)
export const createProjectPageRoute = createRouteWithContext('/create-project')
export const registerPageRoute = createRouteWithContext('/register')
export const unauthorizedPageRoute = createRouteWithContext('/unauthorized')
export const sessionExpiredPageRoute = createRouteWithContext('/session-expired')
export const notRegisteredPageRoute = createRouteWithContext('/not-registered')
