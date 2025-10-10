import { actionAdminOnly } from "@/lib/auth"
import { createForm } from "@/lib/formv2/form"
import { createDomain, type Project } from "@/services/projects"

export function addProjectDomainForm(project: Project) {
  return createForm({
    action: async inputs => {
      "use server"
      await actionAdminOnly(`/${ project.id }`)
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
      invalid_origin: "invalid callback url format.",
      invalid_redirect_url: "invalid redirect url format.",
      mismatched_domains: "redirect url must be on the same domain as callback url.",
      insecure_origin: "origin must use https unless using localhost.",
      insecure_redirect_url: "redirect url must use https unless using localhost.",
      domain_exists: "domain already exists for this project.",
      domain_in_use: `domain is already in use by another project: $1`,
    }
  })
}