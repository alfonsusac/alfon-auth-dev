export function toNativeSearchParams(sp: Awaited<PageProps<any>['searchParams']>) {
  if (!sp) return undefined

  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue
    if (Array.isArray(v)) {
      for (const vv of v) {
        usp.append(k, vv)
      }
    } else {
      usp.set(k, v)
    }
  }
  return usp

}