import * as arctic from "arctic"
import { redirect } from "next/navigation"
import { deleteCookie, getSecureCookie, setSecureCookie } from "./cookie"
import { decodeJwt, SignJWT } from "jose"
import { cache } from "react"

const google = new arctic.Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${ process.env.BASE_URL }/auth/google/callback`
)

export async function signIn(redirectTo?: string) {
  const state = arctic.generateState()
  await setSecureCookie('oauth_state', state, 60 * 5) // 5 minutes

  const codeVerifier = arctic.generateCodeVerifier()
  await setSecureCookie('oauth_code_verifier', codeVerifier, 60 * 5) // 5 minutes

  const scopes: string[] = ['openid', 'email']
  const url = google.createAuthorizationURL(state + ' | ' + (redirectTo ?? ''), codeVerifier, scopes)
  return redirect(url.toString())
}


export async function signInHandleCallback(code?: string, received_state?: string) {

  const [state, redirectTo] = (received_state ?? '').split(' | ')

  const storedState = await getSecureCookie('oauth_state')
  const storedCodeVerifier = await getSecureCookie('oauth_code_verifier')

  if (code === undefined || state !== storedState || storedCodeVerifier === undefined) {
    throw new Error("Invalid Request")
  }

  try {

    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)

    const accessToken = tokens.accessToken()

    const decodedIdToken = decodeJwt(tokens.idToken())

    const userId = decodedIdToken.sub

    if (!userId) {
      throw new Error("Invalid ID Token")
    }

    const google_user_res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        'Authorization': `Bearer ${ accessToken }`
      },
      cache: 'no-store'
    })

    const google_user_json = await google_user_res.json()

    if (!google_user_json.verified_email) {
      throw new Error("Email not verified")
    }

    const email = google_user_json.email
    const picture = google_user_json.picture

    await deleteCookie('oauth_state')
    await deleteCookie('oauth_code_verifier')

    const jwt = await issueAuthorizationJWT(userId, email, picture)
    await setSecureCookie('auth_token', jwt, 60 * 60 * 24 * 1) // 1 days

    return redirectTo || '/'

  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      const code = e.code
      console.log(code)
      throw new Error("Invalid Request")
      // ...
    }
    if (e instanceof arctic.ArcticFetchError) {
      // Failed to call `fetch()`
      const cause = e.cause
      console.log(cause)
      throw new Error("Invalid Request")
      // ...
    }
    // Parse error

    throw e
  }
}


export async function issueAuthorizationJWT(id: string, email: string, pfp: string) {
  const jwt = new SignJWT({ sub: id })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(Buffer.from(process.env.JWT_SECRET!, 'utf-8'))
  return jwt
}

// ------

export const $getCurrentUser = cache(async () => {
  const token = await getSecureCookie('auth_token')
  if (!token) return null

  try {
    const decoded = decodeJwt(token)
    if (typeof decoded.sub !== 'string') return null
    return { id: decoded.sub, email: decoded.email as string, pfp: decoded.pfp as string }
  } catch (e) {
    return null
  }
})

export type User = NonNullable<Awaited<ReturnType<typeof $getCurrentUser>>>

// ------

export async function logout() {
  await deleteCookie('auth_token')
  return redirect('/')
}

// -----

export function isAdmin(user: User | null) {
  if (!user) return false
  return user.id === process.env.ADMIN_USER_ID
}

export async function adminOnly(path: string = '/unauthorized') {
  const user = await $getCurrentUser()
  if (!isAdmin(user)) {
    return redirect(path === '/unauthorized' ? `/unauthorized?redirect=${ encodeURIComponent(path) }` : `${path}?error=unauthorized`)
  }
  return true
}
