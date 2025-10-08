import { actionAdminOnly } from "@/lib/auth"
import { datacache } from "@/lib/cache"
import prisma, { serializeDate } from "@/lib/db"
import { generateSecret } from "@/lib/token"
import { validateSecureURLwithLocalhost } from "@/lib/url"
import { validation } from "@/lib/validation"
import { revalidateTag } from "next/cache"

// Project
// Project > fetchers (status: over-fetching)

export const getAllProjects = datacache(getAllUncachedProjects, 'projects')
const revalidateProjects = () => revalidateTag('projects')

async function getAllUncachedProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } }).then(serializeDate)
}


// Project > helpers

export async function getProject(id: string) {
  const projects = await getAllProjects()
  return projects.find(p => p.id === id)
}
export type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>


// Project > mutations

export type ProjectInput = { id: string, name: string, description: string }

const validateProjectInput = validation(async (input: ProjectInput) => {
  if (!input.name || !input.id) return "missing_fields"
  if (!/^[a-zA-Z0-9-_]+$/.test(input.id)) return "invalid_id"
  return input
})

export async function createProject(input: ProjectInput, user_id: string) {
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (await getProject(data.id)) return "id_exists"
  const res = await prisma.project.create({
    data: {
      ...data, user_id,
      keys: { create: { name: "Default Key", client_secret: generateSecret(), } }
    }
  })
  revalidateProjects()
  return res
}

export async function updateProject(input: ProjectInput, id: string) {
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (!await getProject(id)) return "not_found"
  if (id !== input.id && await getProject(data.id)) return "id_exists"
  const res = await prisma.project.update({ where: { id }, data })
  revalidateProjects()
  return res
}

export async function deleteProject(id: string) {
  if (!await getProject(id)) return "not_found"
  await prisma.project.delete({ where: { id } })
  revalidateProjects()
}





// Project Keys

// Project Keys > fetchers

export const getAllProjectKeysByProjectID = datacache(getAllUncachedProjectKeysByProjectID, projectid => `project_${ projectid }_keys`)
const revalidateProjectProjectKeys = (projectid: string) => revalidateTag(`project_${ projectid }_keys`)

async function getAllUncachedProjectKeysByProjectID(project_id: string) {
  return prisma.projectKey.findMany({ where: { project_id }, orderBy: { createdAt: 'desc' } }).then(serializeDate)
}


export const getProjectKey = datacache(getUncachedProjectKey, id => `project_key_${ id }`)
const revalidateProjectKey = (id: string) => revalidateTag(`project_key_${ id }`)

async function getUncachedProjectKey(id: string) {
  return prisma.projectKey.findFirst({ where: { id } }).then(serializeDate)
}


// Project Keys > helpers

// -

// Project Keys Mutations

export type ProjectKeyInput = { name: string, project_id: string }

const validateProjectKeyInput = validation(async (input: ProjectKeyInput) => {
  if (!input.name || !input.project_id) return "missing_fields"
  if (!await getProject(input.project_id)) return "project_not_found"
  return input
})

export async function createProjectKey(input: ProjectKeyInput) {
  await actionAdminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  const res = await prisma.projectKey.create({ data: { ...data, client_secret: generateSecret() } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function updateProjectKey(input: ProjectKeyInput, id: string) {
  await actionAdminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  if (!await getProjectKey(id)) return "not_found"
  const res = await prisma.projectKey.update({ where: { id }, data })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function regenerateProjectKeySecret(id: string) {
  await actionAdminOnly()
  if (!await getProjectKey(id)) return "not_found"
  const res = await prisma.projectKey.update({ where: { id }, data: { client_secret: generateSecret() } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function deleteProjectKey(id: string) {
  await actionAdminOnly()
  if (!await getProjectKey(id)) return "not_found"
  const res = await prisma.projectKey.delete({ where: { id } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}





// Project Domains

export const getAllProjectDomainsOfProject = datacache(getAllUncachedProjectDomainsOfProject, projectid => `project_${ projectid }_domains`)
const revalidateProjectDomainsOfProject = (projectid: string) => revalidateTag(`project_${ projectid }_domains`)

async function getAllUncachedProjectDomainsOfProject(project_id: string) {
  return prisma.domain.findMany({ where: { project_id }, orderBy: { createdAt: 'desc' } }).then(serializeDate)
}


export const getProjectDomainByID = datacache(getUncachedProjectDomainByID, id => `project_domain_${ id }`)
const revalidateProjectDomainByID = (id: string) => revalidateTag(`project_domain_${ id }`)

async function getUncachedProjectDomainByID(id: string) {
  return prisma.domain.findFirst({ where: { id } }).then(serializeDate)
}


export const getProjectDomainByOrigin = datacache(getUncachedProjectDomainByOrigin, origin => `project_domain_origin_${ origin }`)
const revalidateProjectDomainByOrigin = (origin: string) => revalidateTag(`project_domain_origin_${ origin }`)

async function getUncachedProjectDomainByOrigin(origin: string) {
  return prisma.domain.findFirst({ where: { origin } }).then(serializeDate)
}


// Project Domains Mutations

type DomainInput = { project_id: string, origin: string, redirect_url: string }

const validateProjectDomainInput = validation(async (input: DomainInput) => {
  if (!input.project_id || !input.origin || !input.redirect_url) return "missing_fields"
  if (!await getProject(input.project_id)) return "project_not_found"

  // Check that origin and redirect_url are valid URLs and secure (https or localhost)
  const origin = validateSecureURLwithLocalhost(input.origin)
  const redirectURL = validateSecureURLwithLocalhost(input.redirect_url)
  if (input.origin.startsWith('http://') && !input.origin.includes('localhost')) return "insecure_origin"
  if (input.redirect_url.startsWith('http://') && !input.redirect_url.includes('localhost')) return "insecure_redirect_url"
  if (!origin) return "invalid_redirect_url"
  if (!redirectURL) return "invalid_origin"
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
})

export async function createDomain(input: DomainInput) {
  await actionAdminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error
  if (!await getProject(data.project_id)) return "project_not_found"
  const res = await prisma.domain.create({ data })
  revalidateProjectDomainsOfProject(data.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(data.origin)
}

export async function updateDomain(input: DomainInput, id: string) {
  await actionAdminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error
  const res = await prisma.domain.update({ where: { id }, data })
  revalidateProjectDomainsOfProject(res.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(data.origin)
  revalidateProjectDomainByOrigin(res.origin)
}

export async function deleteDomain(id: string) {
  await actionAdminOnly()
  if (!await getProjectDomainByID(id)) return "not_found"
  const res = await prisma.domain.delete({ where: { id } })
  revalidateProjectDomainsOfProject(res.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(res.origin)
}