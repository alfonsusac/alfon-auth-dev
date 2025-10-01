
// Input1 = '/[projectid]'
// Input2 = { projectid: 123abc }
// Output = '/123abc'

// Input1 = '/[projectid]/[keyid]'
// Input2 = { projectid: 123abc, keyid: 456def }
// Output = '/123abc/456def'

// Input1 = '/projects/[projectid]/keys/[keyid]'
// Input2 = { projectid: 123abc, keyid: 456def }
// Output = '/projects/123abc/keys/456def'

// Input1 = '/[projectid]'
// Input2 = { a: 'b' }
// Output = TypeError (TODO i guess)


export function interpolatePath<
  P extends string,
>(
  path: string,
  params: { [key: string]: string | string[] } // not yet support slug array
) {
  let resolvedPath = path

  // For each entry in params, replace "[key]" in path with <value> of <key>
  // First check if <value> is array. if its array then find "[...key]"
  // No need to encodeURIComponent params, because Next.js already it for us.
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      resolvedPath = resolvedPath.replace(`[...${ key }]`, value.join('/'))
    }
    if (!Array.isArray(value)) {
      resolvedPath = resolvedPath.replace(`[${ key }]`, value)
    }
  }

  return resolvedPath as InterpolatePath<P>
}

export type InterpolatePath<P extends string> =
  P extends `${ infer _Start }[${ infer Param }]${ infer Rest }`
  ? `${ _Start }${ string }${ InterpolatePath<Rest> }`
  : P