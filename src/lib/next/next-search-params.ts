declare global {
  type PageSearchParams = Awaited<PageProps<'/'>['searchParams']>
}

export function toNativeSearchParams(sp: PageSearchParams) {
  if (!sp) return new URLSearchParams()

  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue
    if (Array.isArray(v)) {
      for (const vv of v) usp.append(k, vv)
    } else usp.set(k, v)
  }
  return usp

}

// Convert PageSearchParams to string like ?key=value&key2=value2
// - sp is already decoded
// - the result is not encoded
export function fromPageSearchParamsToString(sp: PageSearchParams) {
  const asp: [string, string][] = []
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue
    if (Array.isArray(v)) {
      for (const vv of v) asp.push([k, vv])
    } else asp.push([k, v])
  }
  return asp.map(([k, v]) => `${ k }=${ v }`).join('&')
}