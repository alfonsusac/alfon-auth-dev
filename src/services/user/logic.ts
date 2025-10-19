import { datacache } from "@/lib/cache"
import prisma, { serializeDate } from "@/lib/db"
import type { User } from "@/shared/auth/auth"
import { updateTag } from "next/cache"
import type { AvatarUrl, Email, UserName } from "./validations"

export const getUserById = datacache(getUncachedUserById, id => 'user')
const revalidateUser = (id: string) => updateTag(`user:${ id }`)

async function getUncachedUserById(id: string) {
  return prisma.user.findUnique({ where: { id } }).then(serializeDate)
}

export async function createUserFromSession(user: User) {
  const res = await prisma.user.create({
    data: {
      user_profile: {
        create: {
          name: user.name,
          email: user.email,
          avatarUrl: user.picture,
        }
      }
    }
  }).then(serializeDate)
  revalidateUser(res.id)
  return res
}

export async function updateUserProfile(user: User, input: {
  name?: UserName,
  email?: Email,
  avatarUrl?: AvatarUrl,
}) {
  const res = await prisma.userProfile.update({
    where: {
      user_id: user.id
    },
    data: {
      name: input.name?.val,
      email: input.email?.val,
      avatarUrl: input.avatarUrl?.val,
    }
  })
  revalidateUser(user.id)
  return res
}