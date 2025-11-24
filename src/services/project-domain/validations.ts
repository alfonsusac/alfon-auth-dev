import { validateSecureURLwithLocalhost } from "@/lib/core/url"
import { getProject, getProjectDomainByOrigin } from "../project/db"
import { validation } from "@/lib/core/validation"



export const projectDomainInputValidation = validation({
  validate: async (input: {
    project_id: string,
    origin: string,
    redirect_url: string
  }) => {
    if (!input.project_id || !input.origin || !input.redirect_url) return "missing_fields"
    if (!await getProject(input.project_id)) return "project_not_found"

    // Check that origin and redirect_url are valid URLs and secure (https or localhost)
    const origin = validateSecureURLwithLocalhost(input.origin)
    if (typeof origin === 'string') return `invalid_origin_${ origin }` as const
    const redirectURL = validateSecureURLwithLocalhost(input.redirect_url)
    if (typeof redirectURL === 'string') return `invalid_redirect_url_${ redirectURL }` as const
    if (redirectURL.host !== origin.host) return "mismatched_domains"

    // Check if the domain already exists
    const existing = await getProjectDomainByOrigin(input.origin)
    if (existing) {
      // Domain exists! now we check whether if its from the same project or not (or localhost)
      if (existing.project_id === input.project_id) return "domain_exists"
      if (existing.project_id !== input.project_id && !input.origin.includes('localhost')) return `domain_in_use=${ existing.project_id }` as const
    }

    return {
      project_id: input.project_id,
      origin: origin.origin,
      redirect_url: redirectURL.href,
    }
  },
  errors: {
    project_not_found: "project not found.",
    missing_fields: "missing required fields.",
    mismatched_domains: "redirect url must be on the same domain as callback url.",
    domain_exists: "domain already exists for this project.",
    domain_in_use: "domain is already in use by another project: $1",

    invalid_origin_empty_url: "origin cannot be empty.",
    invalid_origin_insecure_protocol: "origin must use https unless using localhost.",
    invalid_origin_invalid_protocol: "origin has an invalid protocol.",
    invalid_origin_invalid_host: "origin has an invalid host.",
    invalid_origin_invalid_port: "origin has an invalid port.",
    invalid_origin_invalid_path: "origin cannot include a path.",
    invalid_origin_invalid_query: "origin cannot include a query string.",
    invalid_origin_missing_protocol: "origin must include http:// or https://",
    invalid_origin_invalid_fragment: "origin cannot include a fragment.",

    invalid_redirect_url_empty_url: "redirect url cannot be empty.",
    invalid_redirect_url_invalid_protocol: "redirect url has an invalid protocol.",
    invalid_redirect_url_invalid_host: "redirect url has an invalid host.",
    invalid_redirect_url_invalid_port: "redirect url has an invalid port.",
    invalid_redirect_url_invalid_path: "redirect url cannot include a path.",
    invalid_redirect_url_invalid_query: "redirect url cannot include a query string.",
    invalid_redirect_url_insecure_protocol: "redirect url must use https unless using localhost.",
    invalid_redirect_url_missing_protocol: "redirect url must include http:// or https://",
    invalid_redirect_url_invalid_fragment: "redirect url cannot include a fragment.",
  }
})

export type DomainInput = typeof projectDomainInputValidation.$type