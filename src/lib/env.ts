const EnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BASE_URL",
  "JWT_SECRET",
  "ADMIN_USER_ID",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED"
] as const

type EnvVars = (typeof EnvVars)[number]


export function envvars(key: EnvVars) {
  const value = process.env[key]
  if (!value) {
    const err = new Error(`Missing env var: ${ key }`)
    console.log('⚠️ Missing Env Var:', key)
    Error.captureStackTrace(err, envvars)
    throw err
  }
  return value
}