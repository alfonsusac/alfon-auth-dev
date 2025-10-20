// auth as provider

import { getCurrentUserSessionProvider, type Session } from "@/shared/auth/auth"
import { getProject, getProjectDomainByOrigin, type Project, type ProjectDomain } from "../projects"
import { type ValidatedURL } from "@/lib/url/url"
import { generateSecret } from "@/lib/token"
import prisma from "@/lib/db"


export async function allowProjectAuthorization({ user, project, domain, redirect_uri, code, next }: {
  user: Session,
  project: Project
  domain: ProjectDomain
  redirect_uri: ValidatedURL,
  code: string,
  next: string,
}) {
  console.log(redirect_uri)
  const redirect_uri_no_query = redirect_uri.format('scheme://hostname.com/path')
  console.log("Comparing redirect URIs:", { expected: domain.redirect_url, provided: redirect_uri_no_query }) // remove after testing
  if (domain.redirect_url !== redirect_uri_no_query)
    return "domain_mismatch"

  const auth_code = generateSecret()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  const expiresAtEpochSeconds = Math.floor(expiresAt.getTime() / 1000)

  await prisma.authCode.create({
    data: {
      code,
      user_id: user.user_id,
      project_id: project.id,
      project_domain_id: domain.id,
      expires_at: expiresAtEpochSeconds,
    }
  })

  redirect_uri.searchParams.set('code', code)
  redirect_uri.searchParams.set('state', auth_code)

  console.log("[allowProjectAuthorization] redirecting to", redirect_uri.format('scheme://hostname.com/path?query')) // remove after testing

  return {
    nextStepUrl: redirect_uri.toString(),
  }
}

export async function denyProjectAuthorization(params: {
  redirect_uri: ValidatedURL,
  code: string,
  next: string,
}) {
  params.redirect_uri.searchParams.set('error', 'access_denied')
  params.redirect_uri.searchParams.set('code', params.code)
  params.redirect_uri.searchParams.set('next', params.next)
  params.redirect_uri.fragment = '' // clear fragment if any

  return {
    nextStepUrl: params.redirect_uri.toString()
  }
}