import type { getProject, getProjectDomainByID, getProjectKey } from "./project/db"

export type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>
export type ProjectDomain = NonNullable<Awaited<ReturnType<typeof getProjectDomainByID>>>
export type ProjectKey = NonNullable<Awaited<ReturnType<typeof getProjectKey>>>