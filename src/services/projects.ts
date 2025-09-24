import { adminOnly, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/db"
import { generateSecret } from "@/lib/token"
import { validateURL } from "@/lib/url"
import { validation } from "@/lib/validation"
import { cache } from "react"



// Project

export const getProject = cache(get_project)
export const getAllProjects = cache(get_all_projects)

async function get_project(id: string) {
  const res = await prisma.project.findFirst({
    where: { id },
    include: { keys: { orderBy: { createdAt: 'desc' } }, domains: { orderBy: { createdAt: 'desc' } } }
  })
  if (!res) return null
  const { keys, domains, ...project } = res
  return {
    ...project,
    keys: requireAdmin(keys),
    domains: requireAdmin(domains),
  }
}

async function get_all_projects() {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
}



// Project Mutations

export type ProjectInput = { id?: string, name?: string, description?: string }

const validateProjectInput = validation(async (input: ProjectInput) => {
  if (!input.name || !input.id) return "missing_fields"
  if (!/^[a-zA-Z0-9-_]+$/.test(input.id)) return "invalid_id"
  return input as Required<ProjectInput>
})

export async function createProject(input: ProjectInput) {
  const user = await adminOnly()
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (await getProject(data.id)) return "id_exists"
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
  await adminOnly()
  const { error, data } = await validateProjectInput(input)
  if (error) return error
  if (!await getProject(id)) return "not_found"
  await prisma.project.update({ where: { id }, data })
}

export async function deleteProject(id: string) {
  await adminOnly()
  if (!await getProject(id)) return "not_found"
  await prisma.project.delete({ where: { id } })
}





// Project Keys

export const getProjectKey = cache(get_project_key)
export const getAllProjectKeys = cache(get_all_project_keys)


async function get_project_key(id: string) {
  await adminOnly()

  return prisma.projectKey.findFirst({
    where: { id },
  })
}

async function get_all_project_keys(project_id: string) {
  await adminOnly()

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
  if (!await getProject(input.project_id)) return "project_not_found"
  return input as Required<ProjectKeyInput>
})

export async function createProjectKey(input: ProjectKeyInput) {
  await adminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  return prisma.projectKey.create({ data: { ...data, client_secret: generateSecret() } })
}

export async function updateProjectKey(input: ProjectKeyInput, id: string) {
  await adminOnly()
  const { error, data } = await validateProjectKeyInput(input)
  if (error) return error
  if (!await getProjectKey(id)) return "not_found"
  await prisma.projectKey.update({ where: { id }, data })
}

export async function regenerateProjectKeySecret(id: string) {
  await adminOnly()
  if (!await getProjectKey(id)) return "not_found"
  await prisma.projectKey.update({ where: { id }, data: { client_secret: generateSecret() } })
}

export async function deleteProjectKey(id: string) {
  await adminOnly()
  if (!await getProjectKey(id)) return "not_found"
  await prisma.projectKey.delete({ where: { id } })
}





// Project Domains

export const getProjectDomain = cache(get_project_domain)
export const getAllProjectDomains = cache(get_all_project_domains)


async function get_project_domain(id: string) {
  await adminOnly()
  return prisma.domain.findFirst({
    where: { id },
  })
}

async function get_all_project_domains(project_id: string) {
  await adminOnly()
  return prisma.domain.findMany({
    where: { project_id },
    orderBy: { createdAt: 'desc' },
  })
}


// Project Domains Mutations


type DomainInput = {
  project_id: string
  callback_url: string
  redirect_url: string
}

const validateProjectDomainInput = validation(async (input: DomainInput) => {
  if (!input.project_id || !input.callback_url || !input.redirect_url) return "missing_fields"
  if (!await getProject(input.project_id)) return "project_not_found"
  const redirectURL = validateURL(input.redirect_url)
  const callbackURL = validateURL(input.callback_url)
  if (!redirectURL) return "invalid_callback_url"
  if (!callbackURL) return "invalid_redirect_url"
  if (redirectURL.host !== callbackURL.host) return "mismatched_domains"
  return input as Required<DomainInput>
})

export async function createDomain(input: DomainInput) {
  await adminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error
  return prisma.domain.create({ data })
}

export async function updateDomain(input: DomainInput, id: string) {
  await adminOnly()
  const { error, data } = await validateProjectDomainInput(input)
  if (error) return error
  return prisma.domain.update({ where: { id }, data })
}

export async function deleteDomain(id: string) {
  await adminOnly()
  if (!await getProjectDomain(id)) return "not_found"
  await prisma.domain.delete({ where: { id } })
}