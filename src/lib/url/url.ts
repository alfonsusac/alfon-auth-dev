export function validateSecureURLwithLocalhost(url?: string | null | { set?: string | null | undefined }) {
  if (typeof url === 'object' && url !== null) {
    url = url.set
  }
  if (!url) return 'empty_url'

  const parsedUrl = parseURL(url)

  // infer phase
  if (parsedUrl.protocol === null) parsedUrl.protocol = 'https'
  parsedUrl.hash = null // ignore fragment for validation purposes

  // validation phase
  if (!isValidProtocol(parsedUrl.protocol)) return 'invalid_protocol'
  if (!isValidHost(parsedUrl.hostname)) return 'invalid_host'
  if (!isValidPort(parsedUrl.port)) return 'invalid_port'
  if (!isValidPaths(parsedUrl.pathnames)) return 'invalid_path'
  if (!isValidQuery(parsedUrl.query)) return 'invalid_query'

  if (parsedUrl.protocol === 'http' && parsedUrl.hostname !== 'localhost') return 'insecure_protocol'

  return parsedUrl.toURL()
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
    if (!new RegExp(`^${ segment }$`).test(path)) return false
  }
  return true
}
function isValidQuery(query: string | null) {
  if (query === null) return true
  return new RegExp(`^${ query }$`).test(query)
}
function isValidFragment(fragment: string | null) {
  if (fragment === null) return true
  return new RegExp(`^${ fragment }$`).test(fragment)
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

const pathAbempty = `(\/|${ segment })*` // can_be_empty_warning
const pathAbsolute = `\/(${ segmentNz } (/${ segment })*)?`
const pathNoScheme = `${ segmentNzNc }(/${ segment })*`
const pathRootless = `${ segmentNz }(/${ segment })*`

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
const label = `${ alpha }((${ ldhStr }){0,61}${ letDig })?`
const subdomain = `(${ label }.)*${ label }`
const domain = `${ subdomain }` // and also must be <= 253 characters in total length

// RFC 1123

const domainNameRelaxed = `[a-zA-Z0-9](?:[a-zA-Z0-9\\-.]{0,253}[a-zA-Z0-9])?`
const dnsHost = `${ ipLiteral }|${ ipV4Address }|${ domainNameRelaxed }`




//
//
// Parsing

function parseURL(url: string) {

  // https://user:pass@sub.example.com:8080/folder/page?x=1#frag
  const [nohash, hash] = url.includes('#') ? url.split('#', 2) : [url, null]
  // https://user:pass@sub.example.com:8080/folder/page?x=1
  const [nohashquery, query] = nohash.includes('?') ? nohash.split('?', 2) : [nohash, null]
  // https://user:pass@sub.example.com:8080/folder/page
  const [protocol, noprotocolwithpath] = nohashquery.includes('://') ? nohashquery.split('://', 2) : [null, nohashquery]
  // user:pass@sub.example.com:8080/folder/page
  const [hostnamewithport, absolutePathWithoutLeadingSlash] = noprotocolwithpath.includes('/') ? noprotocolwithpath.split('/', 2) : [noprotocolwithpath, null]
  // user:pass@sub.example.com:8080
  const [userinfo, hostnameport] = hostnamewithport.includes('@') ? hostnamewithport.split('@', 2) : [null, hostnamewithport]
  // sub.example.com:8080
  const [hostname, port] = hostnameport.includes(':') ? hostnameport.split(':', 2) : [hostnameport, null]

  const path = '/' + (absolutePathWithoutLeadingSlash ?? '')
  const pathnames = absolutePathWithoutLeadingSlash?.split('/') ?? null
  const normalisedProtocol = protocol?.toLowerCase() ?? null
  const normalisedHostname = hostname.toLowerCase()
  const normalisedPort = port?.replace(/^0*/, '') ?? null

  return {
    /** full original url */
    original: url,
    /** https */
    protocol: normalisedProtocol,
    /** sub.example.com */
    hostname: normalisedHostname,
    /** :8000 */
    port: normalisedPort,
    /** /folder/page */
    path,
    /** ['folder', 'page'] */
    pathnames,
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

    toURL() {
      // should be valid by the time this is called (validate externally)
      if (this.protocol === null) return 'new_url()_requires_a_protocol'
      if (!isValidProtocol(this.protocol)) return 'invalid_protocol'
      if (!isValidHost(this.hostname)) return 'invalid_host'
      if (!isValidPort(this.port)) return 'invalid_port'
      if (!isValidPaths(this.pathnames)) return 'invalid_path'
      if (!isValidQuery(this.query)) return 'invalid_query'

      return new URL(this.toString())
    }
  }
}

export type ParsedURL = ReturnType<typeof parseURL>
export type ParsedURLError = ReturnType<ParsedURL['toURL']> extends infer A ? A extends string ? A : never : never