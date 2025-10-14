import { cookies } from "next/headers"

export async function setSecureCookie(key: string, value: { value: string, duration: number }): Promise<void>
export async function setSecureCookie(key: string, value: string, duration: number): Promise<void>
export async function setSecureCookie(key: string, value: { value: string, duration: number } | string, duration?: number) {
  if (typeof value === 'object') {
    duration = value.duration
    value = value.value
  }
  (await cookies()).set(key, value, {
    secure: true, path: "/", httpOnly: true, maxAge: duration
  })
}
export class CookieValue {
  constructor(
    public value: string,
    public duration: number
  ) { }
}


export async function getSecureCookie(key: string) {
  return (await cookies()).get(key)?.value
}

export async function deleteCookie(key: string) {
  (await cookies()).delete(key)
}