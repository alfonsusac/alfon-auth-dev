import { getCurrentUser, isAdmin } from "./auth"

async function AdminOnly(props: {
  children?: React.ReactNode
  fallback?: React.ReactNode
}) {
  console.log("D - <AdminOnly>")
  const user = await getCurrentUser()
  if (!isAdmin(user)) {
    return props.fallback ?? null
  }
  return <>{props.children}</>
}

export const AUTH = {
  AdminOnly
}