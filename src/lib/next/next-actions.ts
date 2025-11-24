import { headers } from "next/headers"
import { parseURL } from "../core/url"
import { secureRedirectString } from "../auth/redirect"

export async function getActionContext() {
  const header = await headers()
  const referer = header.get('referer') || ''
  const url = parseURL(referer)
  return {
    from: secureRedirectString(url.path + (url.query ? '?' + url.query : '')) as `/${ string }`,
    header,
  }
}