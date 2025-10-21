export function secureRedirectString(to: string) {
  if (!to) return '/'
  if (to.startsWith('/')) return to as `/${string}`

  try {
    const url = new URL(to, process.env.BASE_URL)
    if (url.origin !== process.env.BASE_URL) {
      return '/' as const
    }
    return url.pathname + url.search + url.hash as `/${string}`
  } catch (error) {
    return '/' as const
  }
}