export function splitOnce(str: string, separator: string): [string, string] {
  const index = str.indexOf(separator);
  if (index === -1) {
    return [str, ''];
  }
  const firstPart = str.substring(0, index);
  const secondPart = str.substring(index + separator.length);
  return [firstPart, secondPart];
}