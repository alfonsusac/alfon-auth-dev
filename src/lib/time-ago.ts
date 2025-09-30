export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second']
  ]
  for (const [sec, name] of intervals) {
    const count = Math.floor(seconds / sec)
    if (count >= 1) return `${ count } ${ name }${ count > 1 ? 's' : '' } ago`
  }
  return 'just now'
}