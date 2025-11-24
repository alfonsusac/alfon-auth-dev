import type { NextConfig } from "next"

// console.log("Next.js config loaded")
// console.log("NODE_ENV:", process.env.NODE_ENV)
// console.log("Env Vars:", process.env.BASE_URL)
// console.log("Env Vars:", process.env['BASE_URL'])

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
}

export default nextConfig


// Envs
// only check env vars once at build and at server start.

export const EnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BASE_URL",
  "JWT_SECRET",
  "ADMIN_USER_ID",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED"
] as const

type EnvVarMap = { [key in EnvVars]: string }

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarMap { }
  }
}

export type EnvVars = (typeof EnvVars)[number]

// Make sure all required env vars are set

const errors: string[] = []

for (const key of EnvVars) {
  const value = process.env[key]
  if (!value)
    errors.push(`Missing env var: ${ key }`)
  else if (key === "JWT_SECRET" && value.length < 32)
    errors.push(`JWT_SECRET must be at least 32 characters`)
  else if (key === "BASE_URL") {
    if (!value.startsWith("http://") && !value.startsWith("https://"))
      errors.push(`BASE_URL must start with http:// or https://`)
    else if (value.endsWith("/"))
      errors.push(`BASE_URL must not end with a trailing slash`)
  }
}

if (errors.length > 0) {
  errors.forEach(err => {
    console.error('⚠️  [next.config.ts]', err)
  })
  throw 0
}