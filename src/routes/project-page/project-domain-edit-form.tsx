import { actionAdminOnly } from "@/lib/auth"
import { createForm } from "@/lib/formv2/form"
import { updateDomain, type Project, type ProjectDomain } from "@/services/projects"
import type { DomainProp, ProjectProp } from "../types"

export function editProjectDomainForm({ project, domain }: ProjectProp & DomainProp) {
  return createForm({
    action: async inputs => {
      "use server"
      await actionAdminOnly(`/${ project.id }`)
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
      missing_fields: "please fill out all required fields.",
      project_not_found: "project not found.",
      invalid_origin: "invalid origin.",
      invalid_redirect_url: "invalid redirect url.",
      mismatched_domains: "callback and redirect urls must share the same domain.",
      insecure_origin: "origin must use https unless using localhost.",
      insecure_redirect_url: "redirect url must use https unless using localhost.",
      domain_exists: "domain already exists for this project.",
      domain_in_use: `domain is already in use by another project: $1`,
    }
  })
}