import { splitOnce } from "./split-once"

export function validateSecureURLwithLocalhost(url?: string | null | { set?: string | null | undefined }) {
  if (typeof url === 'object' && url !== null) url = url.set
  if (!url)
    return 'empty_url'

  const parsedUrl = parseURL(url)

  // infer phase
  if (parsedUrl.protocol === null) parsedUrl.protocol = 'https'
  parsedUrl.hash = null 

  const validatedURL = parsedUrl.validate()
  if (validatedURL.error)
    return validatedURL.error

  if (parsedUrl.protocol === 'http' && parsedUrl.hostname !== 'localhost')
    return 'insecure_protocol'

  return validatedURL.toURL()
}

//
//
// Validation helpers

function isValidProtocol(protocol: string) {
  return protocol === 'http' || protocol === 'https' //valid protocols (can be parameterized if needed)
}
function isValidHost(hostname: string) {
  const hostRegex = new RegExp(`^${ host }$`) // RFC 3986
  const hostMatch = hostRegex.exec(hostname)
  if (!hostMatch) return false
  const regName = hostMatch.groups?.regName
  if (!regName) return true // it's an IP address or IP literal, which is valid if it matched the regex
  if (!new RegExp(`^${ domainNameRelaxed }$`).test(regName)) return false // RFC 1123, the less strict check
  if (!new RegExp(`^${ domain }$`).test(regName)) return false // RFC 1035, the more strict check
  return true
}
function isValidPort(port: string | null) {
  if (port === null) return true
  return new RegExp(`^${ port }$`).test(port)
}
function isValidPaths(paths: string[] | null) {
  if (paths === null) return true
  for (const path of paths) {
    if (!new RegExp(`^(${ pchar }$)+`).test(path)) return false
  }
  return true
}
function isValidPath(path_str: string) {
  if (path_str === null) return true
  return new RegExp(`^${ path }$`).test(path_str)
}
function isValidQuery(query_str: string | null) {
  if (query_str === null) return true
  return new RegExp(`^${ query }$`).test(query_str)
}
function isValidFragment(fragment_str: string | null) {
  if (fragment_str === null) return true
  return new RegExp(`^${ fragment }$`).test(fragment_str)
}









//
//
// Origin validation

// RFC 3986

const alpha = '[a-zA-Z]'
const digit = '[0-9]'
const hexdig = '[0-9a-fA-F]'

const genDelims = '[:/?#\\[\\]@]'
const subDelims = "[!$&'()*+,;=]"
const reserved = `${ genDelims }|${ subDelims }`
const unreserved = [alpha, digit, '[\\-._~]'].join('|')
const pctEncoded = `%(${ hexdig }){2}`
const pchar = [unreserved, pctEncoded, subDelims, '[:@]'].join('|')

const segment = `(${ pchar })*` // can_be_empty_warning
const segmentNz = `(${ pchar })+`
const segmentNzNc = `(${ unreserved }|${ pctEncoded }|${ subDelims }|[@])+`

const pathAbempty = `(\/${ segment })*` // can_be_empty_warning
const pathAbsolute = `\/(${ segmentNz }(/${ segment })*)?`
const pathNoScheme = `${ segmentNzNc }(/${ segment })*`
const pathRootless = `${ segmentNz }(/${ segment })*`
const path = `${ pathAbempty }|${ pathAbsolute }|${ pathNoScheme }|${ pathRootless }`

const port = `(${ digit })*` // can_be_empty_warning

const ipVFuture = `v(${ hexdig })+\\.(${ unreserved }|${ subDelims }|[:])+`
const decOctet = `0-9 | [1-9][0-9] | 1[0-9]{2} | 2[0-4][0-9] | 25[0-5]`.replace(/\s+/g, '')
const ipV4Address = `${ decOctet }\\.${ decOctet }\\.${ decOctet }\\.${ decOctet }`
const h16 = `(${ hexdig }){1,4}`
const ls32 = `${ h16 }:${ h16 })|(${ ipV4Address }`
const ipV6Address =
  `                           (${ h16 }:){6}${ ls32 }
|                           ::(${ h16 }:){5}${ ls32 }
|                (${ h16 })?::(${ h16 }:){4}${ ls32 }
|((${ h16 }:){0,1}${ h16 })?::(${ h16 }:){3}${ ls32 }
|((${ h16 }:){0,2}${ h16 })?::(${ h16 }:){2}${ ls32 }
|((${ h16 }:){0,3}${ h16 })?::     ${ h16 }:${ ls32 }
|((${ h16 }:){0,4}${ h16 })?::              ${ ls32 }
|((${ h16 }:){0,5}${ h16 })?::               ${ h16 }
|((${ h16 }:){0,6}${ h16 })?::`.replace(/\s+/g, '')
const ipLiteral = `\\[(${ ipV6Address }|${ ipVFuture })\\]`
const regName = `(${ unreserved }|${ pctEncoded }|${ subDelims })*` // can_be_empty_warning
const host = `${ ipLiteral }|${ ipV4Address }|(?<regName>${ regName })`
const userinfo = `(${ unreserved }|${ pctEncoded }|${ subDelims }|[:])*`
const authority = `(${ userinfo }@)?${ host }(:${ port })?`

const fragment = `(${ pchar }|[/?])*` // can_be_empty_warning
const query = `(${ pchar }|[/?])*` // can_be_empty_warning
const scheme = `${ alpha }(${ alpha }|${ digit }|[+-.])*` // cannot_be_empty_warning
const hierPart =
  `(\\/\\/${ authority }${ pathAbempty }
| ${ pathAbsolute }
| ${ pathRootless })?`.replace(/\s+/g, '')
const uri = `${ scheme }:${ hierPart }(\\?${ query })?(\\#${ fragment })?`

const relativePart =
  `(//${ authority }${ pathAbempty }
  |${ pathAbsolute }
  |${ pathNoScheme })?`.replace(/\s+/g, '')
const relativeRef = `${ relativePart }(?${ query })?(#${ fragment })?`
export const uriReference = `${ uri }|${ relativeRef }`

export const absoluteURI = `${ scheme }:${ hierPart }(?${ query })?`


// RFC 9110

const absolutePath = `(/${ segment })+`
const partialURI = `${ relativePart }(${ query })?`
const httpRelatedURISchemes = ['http', 'https']
const httpURI = `http://${ authority }${ pathAbempty }(?${ query })?`
const httpsURI = `https://${ authority }${ pathAbempty }(?${ query })?`
const host2 = `${ host }(:${ port })?`

// RFC 952 

const domainName = `[a-zA-Z](?:[a-zA-Z0-9\\-.]{0,22}[a-zA-Z0-9])?`

// RFC 1035

const letDig = `${ alpha }|${ digit }`
const letDigHyp = `${ letDig }|[-]`
const ldhStr = `(${ letDigHyp })+`
const label = `${ alpha }((${ ldhStr }){0,61}(${ letDig }))?`
const subdomain = `(${ label }.)*${ label }`
const domain = `${ subdomain }` // and also must be <= 253 characters in total length

// RFC 1123

const domainNameRelaxed = `[a-zA-Z0-9](?:[a-zA-Z0-9\\-.]{0,253}[a-zA-Z0-9])?`
const dnsHost = `${ ipLiteral }|${ ipV4Address }|${ domainNameRelaxed }`




//
//
// Parsing

export function parseURL(url: string) {

  // https://user:pass@sub.example.com:8080/folder/page?x=1#frag
  const [nohash, hash] = url.includes('#') ? splitOnce(url, '#') : [url, null]
  // https://user:pass@sub.example.com:8080/folder/page?x=1
  const [nohashquery, query] = nohash.includes('?') ? splitOnce(nohash, '?') : [nohash, null]
  // https://user:pass@sub.example.com:8080/folder/page
  const [unnormalised_protocol, noprotocolwithpath] = nohashquery.includes('://') ? splitOnce(nohashquery, '://') : [null, nohashquery]
  // user:pass@sub.example.com:8080/folder/page
  const [hostnamewithport, absolutePathWithoutLeadingSlash] = noprotocolwithpath.includes('/') ? splitOnce(noprotocolwithpath, '/') : [noprotocolwithpath, null]
  // user:pass@sub.example.com:8080
  const [userinfo, hostnameport] = hostnamewithport.includes('@') ? splitOnce(hostnamewithport, '@') : [null, hostnamewithport]
  // sub.example.com:8080
  const [unnormalised_hostname, port] = hostnameport.includes(':') ? splitOnce(hostnameport, ':') : [hostnameport, null]

  const path = '/' + (absolutePathWithoutLeadingSlash ?? '')
  // const pathnames = absolutePathWithoutLeadingSlash?.split('/') ?? null
  const protocol = unnormalised_protocol?.toLowerCase() ?? null
  const hostname = unnormalised_hostname.toLowerCase()
  const normalisedPort = port?.replace(/^0*/, '') ?? null

  return {
    /** full original url */
    original: url,
    /** https */
    protocol: protocol,
    /** sub.example.com (no protocol, no port) */
    hostname: hostname,
    /** :8000 */
    port: normalisedPort,
    /** /folder/page */
    path,
    /** ?key=value&key2=value2 */
    query,
    /** #headings */
    hash,

    toString() {
      let result = ''
      if (this.protocol) result += this.protocol + '://'
      result += this.hostname
      if (this.port) result += ':' + this.port
      result += path
      if (this.query) result += '?' + this.query
      if (this.hash) result += '#' + this.hash
      return result
    },

    /** https://sub.example.com:8000 (protocol + hostname + port) */
    origin() {
      if (this.protocol === null) throw new ParseURLError('Cannot get origin of URL without protocol')
      return this.protocol + '://' + this.hostname + (this.port ? ':' + this.port : '') as `${ string }://${ string }`
    },

    validate() {
      if (this.protocol === null) return { error: 'missing_protocol' as const }
      if (!isValidProtocol(this.protocol)) return { error: 'invalid_protocol' as const }
      if (!isValidHost(this.hostname)) return { error: 'invalid_host' as const }
      if (!isValidPort(this.port)) return { error: 'invalid_port' as const }
      if (!isValidPath(this.path)) return { error: 'invalid_path' as const }
      if (!isValidQuery(this.query)) return { error: 'invalid_query' as const }
      if (!isValidFragment(this.hash)) return { error: 'invalid_fragment' as const }
      const searchParams = new URLSearchParams(this.query ?? undefined)
      const pathnames = absolutePathWithoutLeadingSlash?.split('/') ?? null
      return {
        protocol: this.protocol,
        hostname: this.hostname,
        port: this.port,
        path() { return this.pathnames ? '/' + this.pathnames.join('/') : '' },
        pathnames: pathnames,
        query() { return searchParams.toString() || null },
        searchParams: searchParams,
        fragment: this.hash,
        toURL() { return new URL(this.toString()) },
        origin() { return this.protocol + '://' + this.hostname + (this.port ? ':' + this.port : '') },
        toString() { return this.format('scheme://hostname.com:port/path?query#fragment') },
        format<T extends URLFormatterParameter>(format: T) {
          let result: string = format
          if (format.includes('scheme://')) result = result.replace('scheme://', this.protocol + '://')
          if (format.includes('hostname.com')) result = result.replace('hostname.com', this.hostname)
          if (format.includes(':port')) result = result.replace(':port', this.port !== null ? `:${ this.port }` : '')
          if (format.includes('/path')) result = result.replace('/path', this.path() !== '/' ? this.path() : '')
          if (format.includes('?query')) result = result.replace('?query', this.query() !== null ? `?${ this.query() }` : '')
          if (format.includes('#fragment')) result = result.replace('#fragment', this.fragment !== null ? `#${ this.fragment }` : '')
          return result as URLFormatterResult<T>
        }
      }
    },
  }
}

export type ParsedURL = ReturnType<typeof parseURL>
export type ParsedURLError = ReturnType<ParsedURL['validate']> extends infer A ? A extends { error: string } ? A['error'] : never : never
export type ValidatedURL = ReturnType<ParsedURL['validate']> extends infer A ? A extends { error: string } ? never : A : never

type URLFormatterParameter<
  Scheme extends `scheme://` | `` = `scheme://` | ``,
  Port extends `:port` | `` = `:port` | ``,
  Path extends `/path` | `` = `/path` | ``,
  Query extends `?query` | `` = `?query` | ``,
  Fragment extends `#fragment` | `` = `#fragment` | ``,
> = `${ Scheme }hostname.com${ Port }${ Path }${ Query }${ Fragment }`

type URLFormatterResult<T extends URLFormatterParameter> =
  T extends `${ infer Scheme }hostname.com${ infer A }`
  ? (
    `${ (Scheme extends `scheme://` ? `${ string }://` : '') }${ string }${ A extends `:port${ string }` ? `:${ string }` : `` }${ A extends `${ string }/path${ string }` ? `/${ string }` : `` }${ A extends `${ string }?query${ string }` ? `?${ string }` : `` }${ A extends `${ string }#fragment` ? `#${ string }` : `` }`
  ) : never

class ParseURLError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ParseURLError"
  }
}