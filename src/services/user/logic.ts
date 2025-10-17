import { datacache } from "@/lib/cache"
import prisma, { serializeDate } from "@/lib/db"

export const getUserById = datacache(getUncachedUserById, id => 'user')

async function getUncachedUserById(id: string) {
  return prisma.user.findUnique({ where: { id } }).then(serializeDate)
}

