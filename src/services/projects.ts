import type { Prisma } from "@/generated/prisma"
import { $getCurrentUser, adminOnly, isAdmin, type User } from "@/lib/auth"
import prisma from "@/lib/db"
import { validateURL } from "@/lib/url"
import { randomBytes } from "crypto"
import { cache } from "react"

export async function getProjects(user: User) {
  return prisma?.project.findMany({
    where: { user_id: user.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProject(projectid: string) {
  return prisma?.project.findFirst({ where: { id: projectid } })
}
export async function getProjectWithKeys(projectid: string) {
  await adminOnly()
  return prisma?.project.findFirst({
    where: { id: projectid },
    include: {
      ProjectKey: {
        orderBy: { createdAt: 'desc' }
      }
    },
  })
}

const $findProject = cache(async (project_id: string) => {
  const project = await prisma?.project.findFirst({ where: { id: project_id } })
  return project
})

export async function createProject(project_id?: string, name?: string, desc?: string) {
  const user = await $getCurrentUser()
  if (!user || !isAdmin(user)) return "unauthorized"
  if (!project_id || !name) return "missing_fields"

  const existing = await $findProject(project_id)
  if (existing) return "id_exists"

  const project = await prisma?.project.create({
    data: {
      id: project_id,
      user_id: user.id,
      name,
      description: desc,
    },
  })

  const key = await createProjectKey(project.id, "Default API Key")

  return {
    ...project,
    key,
  }
}

export async function deleteProject(project_id?: string) {
  const user = await $getCurrentUser()
  if (!user || !isAdmin(user)) return "unauthorized"
  if (!project_id) return "missing_fields"

  const existing = await $findProject(project_id)
  if (!existing) return "not_found"

  await prisma?.project.deleteMany({ where: { id: project_id } })
  return true
}

export async function updateProject(project_id?: string, data: Prisma.ProjectUpdateInput = {}) {
  const user = await $getCurrentUser()
  if (!user || !isAdmin(user)) return "unauthorized"
  if (!project_id) return "missing_fields"

  const existing = await $findProject(project_id)
  if (!existing) return "not_found"

  return prisma?.project.update({
    where: { id: project_id },
    data
  })
}


// Project Keys


export async function getProjectKeys(project_id: string) {
  const user = await $getCurrentUser()
  await adminOnly()
  return prisma?.projectKey.findMany({
    where: { project: { user_id: user?.id, id: project_id } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createProjectKey(project_id: string, description: string, domain?: string, callbackURI?: string) {
  await adminOnly()
  const project = await $findProject(project_id)
  if (!project) return "not_found"

  if (!description || !domain || !callbackURI) return "missing_fields"

  const domainURL = validateURL("https://" + domain)
  if (!domainURL) return "invalid_domain"

  const callbackURL = validateURL("https://" + callbackURI)
  if (!callbackURL) return "invalid_callbackURI"

  if (callbackURL.origin !== domainURL.origin)
    return "callbackURI_must_match_domain"

  return prisma.projectKey.create({
    data: {
      projectId: project_id,
      description: description,
      key: randomBytes(32).toString('hex'),
      domain,
      callbackURI,
    },
  })
}

export async function updateProjectKey(project_key_id: string, data: Prisma.ProjectKeyUpdateInput) {
  await adminOnly()
  const existing = await prisma.projectKey.findFirst({ where: { id: project_key_id } })
  if (!existing) return "not_found"

  const domainURL = validateURL("https://" + data.domain)
  if (!domainURL) return "invalid_domain"

  const callbackURL = validateURL("https://" + data.callbackURI)
  if (!callbackURL) return "invalid_callbackURI"

  if (callbackURL.origin !== domainURL.origin)
    return "callbackURI_must_match_domain"

  const updated = await prisma.projectKey.update({
    where: { id: project_key_id },
    data
  })
  return updated
}

export async function deleteProjectKey(project_key_id: string) {
  await adminOnly()
  const existing = await prisma.projectKey.findFirst({
    where: { id: project_key_id }
  })
  if (!existing) return "not_found"
  await prisma.projectKey.delete({
    where: { id: project_key_id }
  })
}