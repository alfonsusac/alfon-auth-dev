import { handleSignInCallback, signInViaGoogle } from "@/lib/auth/authv2"
import { secureRedirectString } from "@/lib/auth/redirect"
import { createAppToken, decodeAppToken } from "@/lib/auth/token"
import { deleteCookie, getSecureCookie, setSecureCookie } from "@/lib/cookie"
import { getUserByProvider } from "@/services/user/logic"
import { redirect } from "next/navigation"
import { cache } from "react"
import { validateProvider } from "./auth-providers"
import { unstable_rethrow } from "next/dist/client/components/unstable-rethrow.server"

type StatePayload = {
  nextPath: string
  nextPathOnUnregistered?: string
}
function encodeStatePayload(payload: StatePayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}
function decodeStatePayload(encoded: string): StatePayload {
  const decoded = Buffer.from(encoded, 'base64url').toString('utf-8')
  return JSON.parse(decoded) as StatePayload
}




// ---


export function signIn(opts: {
  nextPath?: string,
  nextPathOnUnregistered?: string
}) {
  const {
    nextPath = '/',
    nextPathOnUnregistered = '/register'
  } = opts
  return {
    google: async () => {
      const { cookies, url } = await signInViaGoogle(encodeStatePayload({ nextPath, nextPathOnUnregistered }))
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
          provider: 'google',
        }, sub: process.env.ADMIN_USER_ID
      })
      await setSecureCookie('auth_token', jwt, duration)
      const user = await getUserByProvider('google', process.env.ADMIN_USER_ID!)
      if (!user)
        redirect(secureRedirectString(decodeURIComponent(nextPathOnUnregistered)))
      else
        redirect(secureRedirectString(decodeURIComponent(nextPath)))
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

  const { payload, inputError, serverError, meta } = await handleSignInCallback({
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

  if (!meta) console.log("No meta information in sign-in callback")
  const { nextPath, nextPathOnUnregistered } = decodeStatePayload(meta ?? "")

  try {
    const payloadValidated = validateProvider(payload.provider)
    if (payloadValidated === "Invalid provider") throw new Error("Invalid provider in token payload")
    const user = await getUserByProvider(payloadValidated.val, payload.id)
    return { securedNextPath: secureRedirectString(decodeURIComponent(user ? nextPath : nextPathOnUnregistered || '/')) } as const
  
  } catch (error) {
    console.log(`auth callback error - ${ error }`)
    return { securedNextPath: secureRedirectString(decodeURIComponent(nextPath || '/')) } as const
  }
}


// ---


export async function signOut(nextPath: string = '/') {
  await deleteCookie('auth_token')
  // redirect(nextPath)
}


// ---


export const getCurrentUserSessionProvider = cache(async () => {
  try {
    const token = await getSecureCookie('auth_token')
    if (!token) throw new Error("No token found in cookies")

    const { payload, error } = await decodeAppToken(token)
    if (error) throw new Error(`Token decode error: ${ error }`)

    const payloadValidated = validateProvider(payload.provider)
    if (payloadValidated === "Invalid provider") throw new Error("Invalid provider in token payload")

    return {
      user_id: payload.id,
      isAdmin: process.env.ADMIN_USER_ID === payload.id,
      provider: payloadValidated.val,
      providerInfo: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      }
    }
  } catch (error) {
    unstable_rethrow(error)
    console.log(`auth error - ${ error }`)
    return null
  }
})
export type Session = NonNullable<Awaited<ReturnType<typeof getCurrentUserSessionProvider>>>


export const getUser = cache(async () => {
  const session = await getCurrentUserSessionProvider()
  if (!session) return null
  const user = await getUserByProvider(session.provider, session.user_id)
  if (!user) return null
  const { user_id, ...restSession } = session
  const userSession = { ...user, ...restSession }
  return userSession
})
export type User = NonNullable<Awaited<ReturnType<typeof getUser>>>