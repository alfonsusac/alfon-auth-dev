import { randomBytes } from "crypto"
import { navigate } from "../navigate"

export function triggerSuccessBanner(code: string) {
  navigate.replace(`?success=${ code }+${ randomBytes(3).toString('hex') }`)
}