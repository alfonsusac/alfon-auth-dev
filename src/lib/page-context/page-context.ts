declare global {
  type PageContext = { [key: string]: string }
  type PageContextProp = { context?: PageContext }
}




export function resolveHrefFromPageContext(href?: string, context?: PageContext): string {

  if (!href) return ''
  if (!context) return href
  if (!href.includes('#')) return resolveFragmentlessHref(href, context)

  const [nofragmenthref, fragment] = href.split('#', 2)
  return resolveFragmentlessHref(nofragmenthref, context) + '#' + fragment

}




function resolveFragmentlessHref(nofragmenthref: string | undefined, context: PageContext) {

  if (!nofragmenthref?.includes('?'))
    return nofragmenthref + '?' + new URLSearchParams(context).toString()

  const [path, sp] = nofragmenthref.split('?', 2)
  return path + '?' + new URLSearchParams(context).toString() + '&' + sp

}