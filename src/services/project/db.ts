import { datacache, revalidate } from "@/lib/next/next-cache"
import prisma, { serializeDate } from "@/lib/db"
import { generateSecret } from "@/module/generate-secret"
import { adminOnlyService } from "@/shared/auth/admin-only"
import { updateTag } from "next/cache"
import { projectInput, type ProjectInput } from "./validations"
import { isError } from "@/module/action/error"
import { projectKeyInput, type ProjectKeyInput } from "../project-key/validations"
import { projectDomainInputValidation, type DomainInput } from "../project-domain/validations"

// Project

async function getAllUncachedProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } }).then(serializeDate)
}

export const getAllProjects = datacache(getAllUncachedProjects, 'projects')

export async function getProject(id: string) {
  const projects = await getAllProjects()
  return projects.find(p => p.id === id)
}

export async function createProject(user_id: string, input: ProjectInput) {
  await adminOnlyService()
  const data = await projectInput.validate(input)
  if (isError(data)) return data

  if (await getProject(data.id)) return "id_exists"
  const res = await prisma.project.create({
    data: {
      ...data, user_id,
      keys: { create: { name: "Default Key", client_secret: generateSecret(), } }
    }
  })
  revalidate(getAllProjects)
  return res
}

export async function updateProject(project_id: string, input: ProjectInput) {
  const data = await projectInput.validate(input)
  if (isError(data)) return data

  if (!await getProject(project_id)) return "not_found"
  if (project_id !== input.id && await getProject(data.id)) return "id_exists"

  const res = await prisma.project.update({ where: { id: project_id }, data })
  revalidate(getAllProjects)
  return res
}

export async function deleteProject(project_id: string) {
  await adminOnlyService()
  if (!await getProject(project_id)) return "not_found"
  await prisma.project.delete({ where: { id: project_id } })
  revalidate(getAllProjects)
}





// Project Keys

// Project Keys > fetchers

export const getAllProjectKeysByProjectID = datacache(getAllUncachedProjectKeysByProjectID, projectid => `project_${ projectid }_keys`)
const revalidateProjectProjectKeys = (projectid: string) => updateTag(`project_${ projectid }_keys`)

async function getAllUncachedProjectKeysByProjectID(project_id: string) {
  return prisma.projectKey.findMany({ where: { project_id }, orderBy: { createdAt: 'desc' } }).then(serializeDate)
}


export const getProjectKey = datacache(getUncachedProjectKey, id => `project_key_${ id }`)
const revalidateProjectKey = (id: string) => updateTag(`project_key_${ id }`)

async function getUncachedProjectKey(id: string) {
  return prisma.projectKey.findFirst({ where: { id } }).then(serializeDate)
}


// Project Keys > helpers

export async function createProjectKey(input: ProjectKeyInput) {
  await adminOnlyService()
  const data = await projectKeyInput.validate(input)
  if (isError(data)) return data
  const res = await prisma.projectKey.create({ data: { ...data, client_secret: generateSecret() } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function updateProjectKey(input: ProjectKeyInput & { project_key_id: string }) {
  await adminOnlyService()
  const data = await projectKeyInput.validate(input)
  if (isError(data)) return data
  if (!await getProjectKey(input.project_key_id)) return "not_found"
  const res = await prisma.projectKey.update({ where: { id: input.project_key_id }, data })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function regenerateProjectKeySecret(id: string) {
  await adminOnlyService()
  if (!await getProjectKey(id)) return "not_found"
  const res = await prisma.projectKey.update({ where: { id }, data: { client_secret: generateSecret() } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}

export async function deleteProjectKey(id: string) {
  await adminOnlyService()
  if (!await getProjectKey(id)) return "not_found"
  const res = await prisma.projectKey.delete({ where: { id } })
  revalidateProjectProjectKeys(res.project_id)
  revalidateProjectKey(res.id)
}





// Project Domains

export const getAllProjectDomainsOfProject = datacache(getAllUncachedProjectDomainsOfProject, projectid => `project_${ projectid }_domains`)
const revalidateProjectDomainsOfProject = (projectid: string) => updateTag(`project_${ projectid }_domains`)

async function getAllUncachedProjectDomainsOfProject(project_id: string) {
  console.log("fetching domains for project", project_id)
  return prisma.domain.findMany({ where: { project_id }, orderBy: { createdAt: 'desc' } }).then(serializeDate)
}


export const getProjectDomainByID = datacache(getUncachedProjectDomainByID, id => `project_domain_${ id }`)
const revalidateProjectDomainByID = (id: string) => updateTag(`project_domain_${ id }`)

async function getUncachedProjectDomainByID(id: string) {
  return prisma.domain.findFirst({ where: { id } }).then(serializeDate)
}


export const getProjectDomainByOrigin = datacache(getUncachedProjectDomainByOrigin, origin => `project_domain_origin_${ origin }`)
const revalidateProjectDomainByOrigin = (origin: string) => updateTag(`project_domain_origin_${ origin }`)

async function getUncachedProjectDomainByOrigin(origin: string) {
  return prisma.domain.findFirst({ where: { origin } }).then(serializeDate)
}


// Project Domains Mutations

export async function createDomain(input: DomainInput) {
  await adminOnlyService()
  const data = await projectDomainInputValidation.validate(input)
  if (isError(data)) return data
  if (!await getProject(data.project_id)) return "project_not_found"
  const res = await prisma.domain.create({ data })
  revalidateProjectDomainsOfProject(data.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(data.origin)
}

export async function updateDomain(domain_id: string, input: DomainInput) {
  await adminOnlyService()
  const data = await projectDomainInputValidation.validate(input)
  if (isError(data)) return data
  const res = await prisma.domain.update({ where: { id: domain_id }, data })
  revalidateProjectDomainsOfProject(res.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(data.origin)
  revalidateProjectDomainByOrigin(res.origin)
}

export async function deleteDomain(id: string) {
  await adminOnlyService()
  if (!await getProjectDomainByID(id)) return "not_found"
  const res = await prisma.domain.delete({ where: { id } })
  revalidateProjectDomainsOfProject(res.project_id)
  revalidateProjectDomainByID(res.id)
  revalidateProjectDomainByOrigin(res.origin)
}