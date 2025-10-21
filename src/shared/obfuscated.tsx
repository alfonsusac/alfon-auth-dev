export function obfuscateEmail(val?: string, visibleCharsCount = 2) {
  if (!val) return ''
  const [name, domain] = val.split('@')
  if (name.length <= 2) return '*'.repeat(name.length) + '@' + domain
  const visibleChars = Math.ceil(visibleCharsCount / 2)
  const obfuscatedName =
    name.slice(0, visibleChars) +
    '*'.repeat(name.length - 2 * visibleChars) +
    name.slice(-visibleChars)
  return obfuscatedName + '@' + domain
}