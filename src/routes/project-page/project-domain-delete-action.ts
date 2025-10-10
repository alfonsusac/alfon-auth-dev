"use server"

import { actionAdminOnly } from "@/lib/auth"
import { deleteDomain } from "@/services/projects"

export async function deleteDomainAction(domainid: string) {
  await actionAdminOnly()
  return await deleteDomain(domainid)
}