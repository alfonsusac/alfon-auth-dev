import { randomBytes } from "crypto"
import { navigate } from "../resolveAction"

export function triggerSuccessBanner(code: string) {
  navigate(`?success=${ code }+${ randomBytes(3).toString('hex') }`, "replace")
}