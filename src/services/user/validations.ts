import type { PseudoClass } from "@/lib/core/pseudo-class"
import { parseURL } from "@/lib/url/url"



export type UserName = PseudoClass<{ val: string }, 'UserName'>

export function validateUserName(name: string) {
  if (!name || name.trim().length === 0) return 'Name cannot be empty'
  if (name.length > 100) return 'Name cannot be longer than 100 characters'
  return { val: name } as UserName
}



export type Email = PseudoClass<{ val: string }, 'Email'>

export function validateEmail(email: string) {
  const parts = email.split("@")
  if (parts.length !== 2) return 'Invalid email format'
  const [local, domain] = parts
  if (!local || !domain) return 'Invalid email format'
  if (domain.startsWith(".") || domain.endsWith(".")) return 'Invalid email format'
  if (!domain.includes(".")) return 'Invalid email format'
  return { val: email } as Email
}



export type AvatarUrl = PseudoClass<{ val: string }, 'AvatarUrl'>

export function validateAvatarUrl(avatarUrl: string) {
  const parsed = parseURL(avatarUrl).validate()
  if (parsed.error) return `avatar_${parsed.error}` as const
  return { val: avatarUrl } as AvatarUrl
}
