import { ArcticFetchError, generateCodeVerifier, generateState, Google, OAuth2RequestError } from "arctic"
import { CookieValue } from "../cookie"

function encodeState(state: string, extra?: string) {
  return state + (extra ? ('|||' + extra) : '')
}
function decodeState(state: string) {
  const [main, extra] = state.split('|||')
  return [main, extra as string | undefined]
}

const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${ process.env.BASE_URL }/auth/google/callback`
)

export async function signInViaGoogle(meta?: string) {
  const state = encodeState(generateState(), meta)
  const codeVerifier = generateCodeVerifier()
  const scopes = ['openid', 'email']
  const url = google.createAuthorizationURL(state, codeVerifier, scopes)
  return {
    cookies: {
      state: new CookieValue(state, 60 * 5), // 5 minutes
      codeVerifier: new CookieValue(codeVerifier, 60 * 5), // 5 minutes
    },
    url,
  }
}

export async function handleSignInCallback(props: {
  code: string | undefined,
  received_state: string | undefined,
  stored_state: string | undefined,
  stored_code_verifier: string | undefined,
}) {
  if (!props.code) return { inputError: "Missing code" } as const
  if (!props.received_state) return { inputError: "Missing state" } as const
  if (!props.stored_state) return { inputError: "Missing stored state" } as const
  if (!props.stored_code_verifier) return { inputError: "Missing stored code verifier" } as const

  if (props.received_state !== props.stored_state) {
    return { inputError: "Invalid state" } as const
  }

  const [_, meta] = decodeState(props.received_state)

  const { code, stored_code_verifier: storedCodeVerifier } = props

  try {

    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
    const accessToken = tokens.accessToken()
    const google_user_res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { 'Authorization': `Bearer ${ accessToken }` },
      cache: 'no-store'
    })
    const google_user_json = await google_user_res.json()
    if (!google_user_json.verified_email) { } // TODO: handle unverified email
    const id = google_user_json.id
    const email = google_user_json.email
    const verified_email = google_user_json.verified_email
    const picture = google_user_json.picture

    const payload = { id, email, picture, provider: "google" }
    return { payload, meta } as const

  } catch (e) {

    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      const code = e.code
      console.log(code)
      return { serverError: "Invalid Parameter" } as const
    }
    if (e instanceof ArcticFetchError) {
      const cause = e.cause
      console.log(cause)
      return { serverError: "Fetch error" } as const
    }
    console.log(e)
    return { serverError: "Invalid Request" } as const
  }
}