import { adminOnly, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/db"
import { generateSecret } from "@/lib/token"
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

export type ProjectInput = { id?: string, name?: string }

const validateProjectInput = validation(async (input: ProjectInput) => {
  if (!input.name || !input.id) return "missing_fields"
  if (await getProject(input.id)) return "id_exists"
  return input as Required<ProjectInput>
})

export async function createProject(input: ProjectInput) {
  const user = await adminOnly()
  const { error, data } = await validateProjectInput(input)
  if (error) return error
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


async function get_project_key(project_key_id: string) {
  await adminOnly()

  return prisma.projectKey.findFirst({
    where: { id: project_key_id },
  })
}

async function get_all_project_keys(project_id: string) {
  await adminOnly()

  return prisma.projectKey.findMany({
    where: { project: { id: project_id } },
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
  // todo: remove
  return await prisma.projectKey.create({ data: { ...data, client_secret: generateSecret() } })
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