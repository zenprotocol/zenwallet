export function truncateString(string) {
  if (string) {
    console.log('string', string)
    return string.substr(0, 3) + '...' + string.substr(string.length - 4);
  }
}
