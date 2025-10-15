import { secureRedirectString } from "./auth/redirect"

export function isQuerySingle(value: string | string[] | undefined): value is string {
  return typeof value === "string"
}

export function getSingleQuery(value: string | string[] | undefined, defaultValue: string = ""): string {
  if (isQuerySingle(value)) return value
  if (Array.isArray(value)) return value[0] || defaultValue
  return defaultValue
}

