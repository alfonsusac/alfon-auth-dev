import { randomBytes } from "crypto"

export function generateSecret() {
  return randomBytes(32).toString('hex')
}

  