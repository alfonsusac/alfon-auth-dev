export async function formatDate(date: Date, preset: "medium" = "medium") {
  
  
  return `${ Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date) } at ${ Intl.DateTimeFormat('en-GB', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date) }`

}