import { getCurrentUser, isAdmin } from "./auth"

async function AdminOnly(props: {
  children?: React.ReactNode
  fallback?: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!isAdmin(user)) {
    return props.fallback ?? <p className="text-red-500">admin access required</p>
  }
  return <>{props.children}</>
}

export const AUTH = {
  AdminOnly
}