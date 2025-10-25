import { secureRedirectString } from "@/lib/auth/redirect"
import { getSingleQuery } from "@/lib/page-search-params"
import { navigate } from "@/module/navigation"
import { route } from "@/routes/routes"

export function sessionExpired(from_path: string): never {
  return navigate.replace(route.sessionExpiredPage, { from: from_path })
}

export function getNextPath(searchParams: PageSearchParams) {
  return { next: secureRedirectString(decodeURIComponent(getSingleQuery(searchParams.next) || '')) }
}
export function getFromPath(searchParams: PageSearchParams) {
  return { from: secureRedirectString(decodeURIComponent(getSingleQuery(searchParams.from) || '')) }
}
