import { randomBytes } from "crypto"
import { actionNavigate } from "../resolveAction"

export function triggerSuccessBanner(code: string) {
  actionNavigate(`?success=${ code }+${ randomBytes(3).toString('hex') }`, "replace")
}