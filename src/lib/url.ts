export function validateSecureURLwithLocalhost(url?: string | null | { set?: string | null | undefined }) {
  if (typeof url === 'object' && url !== null) {
    url = url.set
  }
  if (!url) return false

  try {
    if (url.startsWith('http://localhost')) return new URL(url)
    if (url.startsWith('https://localhost')) return new URL(url)
    if (url.startsWith('localhost')) return new URL('http://' + url)
  } catch (error) {
    return false
  }


  if (url.includes('://')) {
    const [protocol, rest] = url.split('://', 2)
    if (protocol !== 'http' && protocol !== 'https') return false
    const [hostname, paths] = rest.split('/', 2)
    const originRegex = /^([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?$|^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/i
    if (!originRegex.test(hostname)) return false
    const pathRegex = /^(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@/]*)?(\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@/?]*)?(#[a-zA-Z0-9\-._~%!$&'()*+,;=:@/?]*)?$/
    if (paths && !pathRegex.test('/' + paths)) return false
    return new URL(url)
  } else {
    const [hostname, paths] = url.split('/', 2)
    const originRegex = /^([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?$|^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/i
    if (!originRegex.test(hostname)) return false
    const pathRegex = /^(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@/]*)?(\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@/?]*)?(#[a-zA-Z0-9\-._~%!$&'()*+,;=:@/?]*)?$/
    if (paths && !pathRegex.test('/' + paths)) return false
    return new URL('https://' + url)
  }

}