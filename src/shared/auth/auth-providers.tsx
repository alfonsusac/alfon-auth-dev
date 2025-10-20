import type { Provider as PrismaProvider } from "@/generated/prisma"

export const validProviders = ['google'] as const satisfies PrismaProvider[]

export type Provider = (typeof validProviders)[number]

export function validateProvider(provider: string) {
  if (!validProviders.includes(provider as Provider)) return 'Invalid provider'
  return { val: provider as Provider }
}