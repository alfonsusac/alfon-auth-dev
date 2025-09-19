import { cookies } from "next/headers"

export async function setSecureCookie(key: string, value: string, duration: number) {
  (await cookies()).set(key, value, {
    secure: true, path: "/", httpOnly: true, maxAge: duration
  })
}

export async function getSecureCookie(key: string) {
  return (await cookies()).get(key)?.value
}

export async function deleteCookie(key: string) {
  (await cookies()).delete(key)
}