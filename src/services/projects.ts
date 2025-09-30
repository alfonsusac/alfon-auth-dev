import { actionAdminOnly } from "@/lib/auth"
import prisma from "@/lib/db"
import { generateSecret } from "@/lib/token"
import { validateSecureURLwithLocalhost } from "@/lib/url"
import { validation } from "@/lib/validation"
import { unstable_cache } from "next/cache"
import { cache } from "react"



// Project

export const getProject = cache(unstable_cache(get_project))
export const getAllProjects = cache(unstable_cache(get_all_projects))

async function get_project(id: string) {
  const res = await prisma.project.findFirst({
    where: { id },
    include: { keys: { orderBy: { createdAt: 'desc' } }, domains: { orderBy: { createdAt: 'desc' } } }
  })
  if (!res) return null
  const { keys, domains, ...project } = res
  return project
}

async function get_all_projects() {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
}

export type Project = NonNullable<Awaited<ReturnType<typeof get_project>>>



// Project Mutations

export type ProjectInput = { id?: string, name?: string, description?: string }

const validateProjectInput = validation(async (input: ProjectInput) => {
  if (!input.name || !input.id) return "missing_fields"
  if (!/^[a-zA-Z0-9-_]+$/.test(input.id)) return "invalid_id"
  return input as Required<ProjectInput>
})

export async function createProject(input: ProjectInput) {
  const user = await actionAdminOnly()
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (await get_project(data.id)) return "id_exists"
  await prisma.project.create({
    data: {
      ...data,
      user_id: user.id,
      keys: {
        create: {
          name: "Default Key",
          client_secret: generateSecret(),
        }
      }
    }
  })
}

export async function updateProject(input: ProjectInput, id: string) {
  await actionAdminOnly()
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (!await get_project(id)) return "not_found"
  if (id !== input.id && await get_project(data.id)) return "id_exists"
  await prisma.project.update({ where: { id }, data })
}

export async function deleteProject(id: string) {
  await actionAdminOnly()
  if (!await get_project(id)) return "not_found"
  await prisma.project.delete({ where: { id } })
}





// Project Keys

export const getProjectKey = cache(unstable_cache(get_project_key))
export const getAllProjectKeys = cache(unstable_cache(get_all_project_keys))


async function get_project_key(id: string) {
  return prisma.projectKey.findFirst({
    where: { id },
  })
}

async function get_all_project_keys(project_id: string) {
  return prisma.projectKey.findMany({
    where: { project_id },
    orderBy: { createdAt: 'desc' },
  })
}



// Project Keys Mutations

export type ProjectKeyInput = {
  name: string
  project_id: string
}

const validateProjectKeyInput = validation(async (input: ProjectKeyInput) => {
  if (!input.name || !input.project_id) return "missing_fields"
  if (!await get_project(input.project_id)) return "project_not_found"
  return input as Required<ProjectKeyInput>
})

export async function createProjectKey(input: ProjectKeyInput) {
  await actionAdminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  return prisma.projectKey.create({ data: { ...data, client_secret: generateSecret() } })
}

export async function updateProjectKey(input: ProjectKeyInput, id: string) {
  await actionAdminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  if (!await get_project_key(id)) return "not_found"
  await prisma.projectKey.update({ where: { id }, data })
}

export async function regenerateProjectKeySecret(id: string) {
  await actionAdminOnly()
  if (!await get_project_key(id)) return "not_found"
  await prisma.projectKey.update({ where: { id }, data: { client_secret: generateSecret() } })
}

export async function deleteProjectKey(id: string) {
  await actionAdminOnly()
  if (!await get_project_key(id)) return "not_found"
  await prisma.projectKey.delete({ where: { id } })
}





// Project Domains

export const getProjectDomain = cache(unstable_cache(get_project_domain))
export const getAllProjectDomains = cache(unstable_cache(get_all_project_domains))
export const getProjectDomainByOrigin = cache(unstable_cache(get_project_domain_by_origin))


async function get_project_domain(id: string) {
  await actionAdminOnly()
  return prisma.domain.findFirst({
    where: { id },
  })
}

async function get_all_project_domains(project_id: string) {
  await actionAdminOnly()
  return prisma.domain.findMany({
    where: { project_id },
    orderBy: { createdAt: 'desc' },
  })
}

async function get_project_domain_by_origin(origin: string) {
  return prisma.domain.findFirst({
    where: { origin },
  })
}


// Project Domains Mutations


type DomainInput = {
  project_id: string
  origin: string
  redirect_url: string
}

const validateProjectDomainInput = validation(async (input: DomainInput) => {
  if (!input.project_id || !input.origin || !input.redirect_url) return "missing_fields"
  if (!await get_project(input.project_id)) return "project_not_found"

  const origin = validateSecureURLwithLocalhost(input.origin)
  const redirectURL = validateSecureURLwithLocalhost(input.redirect_url)
  if (input.origin.startsWith('http://') && !input.origin.includes('localhost')) return "insecure_origin"
  if (input.redirect_url.startsWith('http://') && !input.redirect_url.includes('localhost')) return "insecure_redirect_url"
  if (!origin) return "invalid_redirect_url"
  if (!redirectURL) return "invalid_origin"
  if (redirectURL.host !== origin.host) return "mismatched_domains"

  const existing = await get_project_domain_by_origin(input.origin)
  if (existing && existing.project_id === input.project_id && existing.origin === input.origin) return "domain_exists"
  if (existing && existing.project_id !== input.project_id && !input.origin.includes('localhost')) return `domain_in_use=${ existing.project_id }` as const
  if (existing && existing.project_id === input.project_id && !input.origin.includes('localhost')) return "domain_exists"

  return {
    project_id: input.project_id,
    origin: origin.origin,
    redirect_url: redirectURL.href,
  } as Required<DomainInput>
})

export async function createDomain(input: DomainInput) {
  await actionAdminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error

  if (!await getProject(data.project_id)) return "project_not_found"
  return prisma.domain.create({ data })
}

export async function updateDomain(input: DomainInput, id: string) {
  await actionAdminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error
  return prisma.domain.update({ where: { id }, data })
}

export async function deleteDomain(id: string) {
  await actionAdminOnly()
  if (!await get_project_domain(id)) return "not_found"
  await prisma.domain.delete({ where: { id } })
}