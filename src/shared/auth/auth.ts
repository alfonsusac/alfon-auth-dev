import { handleSignInCallback, signInViaGoogle } from "@/lib/auth/authv2"
import { secureRedirectString } from "@/lib/auth/redirect"
import { createAppToken, decodeAppToken } from "@/lib/auth/token"
import { deleteCookie, getSecureCookie, setSecureCookie } from "@/lib/cookie"
import { redirect } from "next/navigation"
import { cache } from "react"





// ---


export function signIn(nextPath: string = '/') {
  return {
    google: async () => {
      const { cookies, url } = await signInViaGoogle(nextPath)
      await setSecureCookie('oauth_state', cookies.state)
      await setSecureCookie('oauth_code_verifier', cookies.codeVerifier)
      redirect(url.toString())
    },
    localhost: async () => {
      if (process.env.NODE_ENV !== 'development')
        throw new Error("Not allowed")

      const { jwt, duration } = await createAppToken({
        payload: {
          id: process.env.ADMIN_USER_ID,
          picture: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=a',
          name: 'Development Admin',
        }, sub: process.env.ADMIN_USER_ID
      })
      await setSecureCookie('auth_token', jwt, duration)
      redirect(secureRedirectString(decodeURIComponent(nextPath || '/')))
    }
  }
}






export async function handleCallback(props: {
  code?: string,
  raw_received_state?: string
}) {
  const stored_state = await getSecureCookie('oauth_state')
  const stored_code_verifier = await getSecureCookie('oauth_code_verifier')

  const received_state = props.raw_received_state

  const { payload, inputError, serverError, meta: nextPath } = await handleSignInCallback({
    code: props.code,
    received_state: received_state,
    stored_state,
    stored_code_verifier,
  })

  deleteCookie('oauth_state')
  deleteCookie('oauth_code_verifier')

  if (inputError) return { inputError } as const
  if (serverError) return { serverError } as const

  const { jwt, duration } = await createAppToken({ payload, sub: payload.id })

  await setSecureCookie('auth_token', jwt, duration)

  return { securedNextPath: secureRedirectString(decodeURIComponent(nextPath || '/')) } as const
}


// ---


export async function signOut(nextPath: string = '/') {
  await deleteCookie('auth_token')
  redirect(nextPath)
}


// ---


export const getCurrentUser = cache(async () => {
  const token = await getSecureCookie('auth_token')
  if (!token) return null

  try {
    const { payload, error } = await decodeAppToken(token)
    if (error) return null
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email ,
      picture: payload.picture,
      isAdmin: payload.id === process.env.ADMIN_USER_ID
    }
  } catch (error) {
    console.error(error)
    return null
  }
})
export type User = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>