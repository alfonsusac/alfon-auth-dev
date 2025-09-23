import { randomBytes } from "crypto"
import { navigate } from "../resolveAction"

export function successCallout(code: string, redirect: string = "") {
  navigate(`${ redirect }?success=${ code }+${ randomBytes(3).toString('hex')}`)
}