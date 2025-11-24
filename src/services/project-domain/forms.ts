// -- forms

import { bindAction } from "@/lib/core/action"
import { fieldMap } from "@/lib/formv2/input-fields/input-fields"
import { form } from "@/module/action/form-action"
import { addProjectDomainAction, updateProjectDomainAction } from "./actions"
import type { ProjectDomain } from "../types"

const projectDomainFields = fieldMap({
  origin: {
    label: "allowed incoming domain",
    helper: "the domain where your application is hosted. (no trailing slash)",
    placeholder: "https://example.com",
    type: "text",
    required: true,
    // defaultValue: domain.origin
  },
  redirect_url: {
    label: "redirect path",
    prefix: 'https://your.domain.com',
    placeholder: "/api/auth/callback",
    type: "text",
    required: true,
    helper: "must be on the same domain as callback url",
    // defaultValue: domain.redirect_url.replace(domain.origin, '')
  }
})

export const updateProjectDomainForm = (domain: ProjectDomain) => form({
  action: bindAction(updateProjectDomainAction, domain.id),
  fields: projectDomainFields
})

export const addProjectDomainForm = form({
  action: addProjectDomainAction,
  fields: projectDomainFields
})