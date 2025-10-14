import { createForm } from "@/lib/formv2/form"
import { createDomain, type Project } from "@/services/projects"
import { adminOnlyAction } from "@/shared/auth/admin-only"

export function addProjectDomainForm(project: Project) {
  return createForm({
    action: async inputs => {
      "use server"
      await adminOnlyAction()
      const res = await createDomain({
        project_id: inputs.project_id,
        origin: inputs.origin,
        redirect_url: inputs.origin + inputs.redirect_url,
      })
      return res
    },
    fields: {
      project_id: {
        type: 'readonly',
        value: project.id
      },
      origin: {
        label: "domain",
        helper: "the domain where your application is hosted. (no trailing slash)",
        placeholder: "https://example.com",
        type: "text",
        required: true
      },
      redirect_url: {
        label: "redirect path",
        prefix: 'https://your.domain.com',
        placeholder: "/api/auth/callback",
        type: "text",
        required: true,
        helper: "must be on the same domain as callback url"
      }
    }
  })({
    errorMessages: {
      project_not_found: "project not found.",
      missing_fields: "missing required fields.",
      mismatched_domains: "redirect url must be on the same domain as callback url.",
      domain_exists: "domain already exists for this project.",
      domain_in_use: "domain is already in use by another project: $1",

      "invalid_origin_new_url()_requires_a_protocol": "origin must include http:// or https://",
      "invalid_redirect_url_new_url()_requires_a_protocol": "redirect url must include http:// or https://",

      invalid_origin_empty_url: "origin cannot be empty.",
      invalid_origin_insecure_protocol: "origin must use https unless using localhost.",
      invalid_origin_invalid_protocol: "origin has an invalid protocol.",
      invalid_origin_invalid_host: "origin has an invalid host.",
      invalid_origin_invalid_port: "origin has an invalid port.",
      invalid_origin_invalid_path: "origin cannot include a path.",
      invalid_origin_invalid_query: "origin cannot include a query string.",

      invalid_redirect_url_empty_url: "redirect url cannot be empty.",
      invalid_redirect_url_invalid_protocol: "redirect url has an invalid protocol.",
      invalid_redirect_url_invalid_host: "redirect url has an invalid host.",
      invalid_redirect_url_invalid_port: "redirect url has an invalid port.",
      invalid_redirect_url_invalid_path: "redirect url cannot include a path.",
      invalid_redirect_url_invalid_query: "redirect url cannot include a query string.",
      invalid_redirect_url_insecure_protocol: "redirect url must use https unless using localhost."
    }
  })
}