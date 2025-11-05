import type { Project, ProjectDomain, ProjectKey } from "@/services/project/db"

export type ProjectProp = { project: Project }
export type DomainProp = { domain: ProjectDomain }
export type ProjectKeyProp = { projectKey: ProjectKey }