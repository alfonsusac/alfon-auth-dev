import { navigate } from "@/lib/navigate"
import { getCurrentUserSessionProvider } from "./auth"
import { getActionContext } from "@/lib/actions"
import { sessionExpired } from "@/routes/(auth-layout)/session-expired-page/interface"

export async function AdminOnly(props: {
  children?: React.ReactNode
  fallback?: React.ReactNode
}) {
  const user = await getCurrentUserSessionProvider()
  if (!user?.isAdmin) {
    return props.fallback ?? null
  }
  return <>{props.children}</>
}


export async function adminOnlyService() {
  const user = await getCurrentUserSessionProvider()
  if (!user?.isAdmin)
    throw new Error("Unauthorized. Please do preliminary auth check control to use this function.")
  return user
}

export async function adminOnlyAction(context?: PageContext, unauthenticated_path: string = '.',) {
  const { user, from } = await getActionContext()
  if (!user) sessionExpired(from)
  if (!user?.isAdmin)
    return navigate.replace(unauthenticated_path, context, { unauthorized: '' })
  return user
}



export async function notAuthenticated() {
  const user = await getCurrentUserSessionProvider()
  if (!user)
    throw new Error("Not authenticated. Please do preliminary auth check control to use this function.")
  return user
}
export async function requireUesr(unauthenticated_path: string = '.',) {
  const { user, from } = await getActionContext()
  if (!user) sessionExpired(from)
  return user
}
