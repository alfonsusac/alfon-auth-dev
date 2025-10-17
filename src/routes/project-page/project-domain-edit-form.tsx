import { createForm } from "@/lib/formv2/form"
import { updateDomain } from "@/services/projects"
import type { DomainProp, ProjectProp } from "../types"
import { adminOnlyAction } from "@/shared/auth/admin-only"

export function editProjectDomainForm({ project, domain }: ProjectProp & DomainProp) {
  return createForm({
    action: async inputs => {
      "use server"
      await adminOnlyAction()
      return await updateDomain({
        project_id: inputs.project_id,
        origin: inputs.origin,
        redirect_url: inputs.origin + inputs.redirect_url,
      }, domain.id)
    },
    fields: {
      project_id: {
        type: 'readonly',
        value: project.id,
      },
      origin: {
        label: "allowed incoming domain",
        helper: "the domain where your application is hosted. (no trailing slash)",
        placeholder: "https://example.com",
        type: "text",
        required: true,
        defaultValue: domain.origin
      },
      redirect_url: {
        label: "redirect path",
        prefix: 'https://your.domain.com',
        placeholder: "/api/auth/callback",
        type: "text",
        required: true,
        helper: "must be on the same domain as callback url",
        defaultValue: domain.redirect_url.replace(domain.origin, '')
      }
    }
  })({
    errorMessages: {
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
}