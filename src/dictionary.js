export function replace (string, definitions) {
  for (let index = 0, length = string.length; index < length; index++) {
    const char = string[index]
    const replacement = definitions[char]

    if (replacement !== undefined) {
      string = string.substr(0, index) +
        replacement +
        string.substr(index + 1)

      const addedCharsCount = String(replacement).length - 1

      index += addedCharsCount
      length += addedCharsCount
    }
  }

  return string
}
