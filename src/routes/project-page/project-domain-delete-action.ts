"use server"

import { deleteDomain } from "@/services/projects"
import { adminOnlyAction } from "@/shared/auth/admin-only"

export async function deleteDomainAction(domainid: string) {
  await adminOnlyAction()
  return await deleteDomain(domainid)
}