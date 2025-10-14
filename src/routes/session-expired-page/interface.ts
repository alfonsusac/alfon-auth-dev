import { navigate } from "@/lib/resolveAction"
import { route } from "../routes"

export function sessionExpired(from_path: string) {
  navigate.replace(route.sessionExpiredPage, { from: from_path })
}