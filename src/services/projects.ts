import { $getCurrentUser, adminOnly, isAdmin, type User } from "@/lib/auth"
import prisma from "@/lib/db"
import { randomBytes } from "crypto"
import { cache } from "react"

export async function getProjects(user: User) {
  const projects = await prisma?.project.findMany({
    where: { user_id: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return projects
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

  const key = await createProjectKeys(project.id, "Default API Key")

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



export async function getProjectKeys(project_id: string) {
  const user = await $getCurrentUser()
  const keys = await prisma?.projectKey.findMany({
    where: { project: { user_id: user?.id, id: project_id } },
    orderBy: { createdAt: 'desc' },
  })
  return keys
}

export async function createProjectKeys(project_id: string, description: string) {
  await adminOnly()
  const project = await $findProject(project_id)
  if (!project) return "not_found"
  const key = await prisma.projectKey.create({
    data: {
      projectId: project_id,
      description: description,
      key: randomBytes(32).toString('hex'),
    },
  })
  return key
}

export async function deleteProjectKeys(project_key_id: string) {
  await adminOnly()
  const existing = await prisma.projectKey.findFirst({
    where: { id: project_key_id }
  })
  if (!existing) return "not_found"
  await prisma.projectKey.delete({
    where: { id: project_key_id }
  })
}