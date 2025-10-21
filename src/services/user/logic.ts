import { datacache, taggeddatacache } from "@/lib/cache"
import prisma, { serializeDate } from "@/lib/db"
import type { Session } from "@/shared/auth/auth"
import { updateTag } from "next/cache"
import type { AvatarUrl, Email, UserName } from "./validations"
import { Provider } from "@/generated/prisma"


export const [getUserById, updateUserCacheById] = taggeddatacache(getUncachedUserById, id => `user:${ id }`)
export const [getUserByProvider, updateUserCacheByProvider] = taggeddatacache(getUncachedUserByProvider, (provider, provider_user_id) => `user:provider:${ provider }:${ provider_user_id }`)

async function getUncachedUserById(id: string) {
  return prisma.user.findUnique({ where: { id } }).then(serializeDate)
}

async function getUncachedUserByProvider(provider: Provider, provider_user_id: string) {
  return prisma.user.findFirst({ where: { providers: { some: { provider, provider_user_id } } } }).then(serializeDate)
}

export type DBUser = NonNullable<Awaited<ReturnType<typeof getUserById>>>

export async function createUserFromSession(session: Session, input: {
  name: UserName,
  avatarUrl: AvatarUrl,
}) {
  const res = await prisma.user.create({
    data: {
      name: input.name.val,
      email: session.providerInfo.email,
      avatarUrl: input.avatarUrl.val,
      providers: {
        create: {
          provider: Provider.google,
          provider_user_id: session.user_id,
        }
      }
    }
  }).then(serializeDate)
  updateUserCacheById(res.id)
  updateUserCacheByProvider(session.provider, session.user_id)
  return res
}

export async function updateUser(session: Session, input: {
  name?: UserName,
  email?: Email,
  avatarUrl?: AvatarUrl,
}) {
  const res = await prisma.user.update({
    where: { id: session.user_id },
    data: {
      name: input.name?.val,
      email: input.email?.val,
      avatarUrl: input.avatarUrl?.val,
    }
  })
  updateUserCacheById(session.user_id)
  updateUserCacheByProvider(session.provider, session.user_id)
  return res
}