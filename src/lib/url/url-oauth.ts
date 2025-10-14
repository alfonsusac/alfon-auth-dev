import type { ParsedUrl } from "next/dist/shared/lib/router/utils/parse-url"
import { absoluteURI } from "./url"

const redirectUri = `${ absoluteURI }`
/** Appendix RFC 6749 says uri-reference but paragraph says it MUST be absolute. */

export function matchRedirectURI(from: ParsedUrl, against: ParsedUrl) {
  const fromUrl = from
  const againstUrl = against

  if (!fromUrl.hostname) return 'redirect_uri_invalid_hostname'
  if (fromUrl.hostname !== againstUrl.hostname) return 'redirect_uri_hostname_mismatch'

  return true
}