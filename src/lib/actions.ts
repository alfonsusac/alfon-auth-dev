import { getCurrentUserSessionProvider } from "@/shared/auth/auth"
import { headers } from "next/headers"
import { parseURL } from "./url/url"
import { secureRedirectString } from "./auth/redirect"

export async function getActionContext() {
  const header = await headers()
  const user = await getCurrentUserSessionProvider()
  const referer = header.get('referer') || ''
  const url = parseURL(referer)
  return {
    user,
    from: secureRedirectString(url.path + (url.query ? '?' + url.query : '')) as `/${ string }`,
    header,
  }
}