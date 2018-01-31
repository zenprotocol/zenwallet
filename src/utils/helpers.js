export function truncateString(string) {
  if (string) {
    console.log('string', string)
    return string.substr(0, 6) + '...' + string.substr(string.length - 6);
  }
}
