import { parseURL } from "@/lib/url/url"

export function validateRedirectUri(redirect_uri: PageSearchParam) {
  if (!redirect_uri) return "redirect_uri_missing"
  if (Array.isArray(redirect_uri)) return "redirect_uri_multiple"

  const parsed = parseURL(redirect_uri).validate()
  if (parsed.error) return `redirect_uri_${ parsed.error }` as const

  return parsed
}



export function validateAuthorizeCode(val: PageSearchParam) {
  if (!val) return "code_missing"
  if (Array.isArray(val)) return "code_multiple"

  return { val }
}




export function validateAuthorizeNext(val: PageSearchParam) {
  if (!val) return "next_missing"
  if (Array.isArray(val)) return "next_multiple"

  return { val }

}

