
import { deleteCookie, getSecureCookie } from "../cookie"
import { decodeJwt, SignJWT } from "jose"
import { cache } from "react"
import { actionNavigate } from "../resolveAction"

// ------

// export async function actionAdminOnly(redirect_path_on_fail: string = '/unauthorized') {
//   const user = await getCurrentUser()
//   if (!user?.isAdmin)
//     actionNavigate(redirect_path_on_fail)
//   return user
// }

