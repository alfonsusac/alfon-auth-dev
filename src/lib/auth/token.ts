import { jwtVerify, SignJWT, type JWTPayload } from "jose"


const JWT_SIGN_KEY = new Uint8Array(Buffer.from(process.env.JWT_SECRET))

type AppTokenPayload = {
  id: string
  name?: string
  email?: string
  picture?: string
  provider: string
}



export async function createAppToken(params: {
  payload: AppTokenPayload,
  sub: string,
}) {
  const expiryTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
  const duration = expiryTime - Math.floor(Date.now() / 1000)
  const jwt = await new SignJWT(params.payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiryTime)
    .setIssuer('https://auth.alfon.dev') // your app's issuer
    .setAudience(params.sub)
    .sign(JWT_SIGN_KEY)
  return { expiryTime, duration, jwt }
}

export async function decodeAppToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SIGN_KEY, {
      issuer: 'https://auth.alfon.dev',
    })
    const { iat, aud, exp, iss, jti, nbf, sub, ...rest } = payload

    if (typeof rest.id !== 'string') throw new Error('Invalid token payload: missing id')

    return { payload: rest as AppTokenPayload } as const
  } catch (e) {
    console.error(e)
    return { error: 'Invalid token' } as const
  }
}