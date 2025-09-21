export function validateURL(url?: string | null | { set?: string | null | undefined }) {
  if (typeof url === 'object' && url !== null) {
    url = url.set
  }

  if (!url) return false
  if (!url.startsWith('https://')) return false
  try {
    const urlURL = new URL(url)
    return urlURL
  } catch {
    return false
  }
}