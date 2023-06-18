export type Dictionary = Record<string, string>

export const CAMELCASE_REGEXP_PATTERN = '(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))'

export function replace(value: string, dictionary: Dictionary): string {
  for (let index = 0, length = value.length; index < length; index++) {
    const char = value[index]
    const replacement = dictionary[char] && String(dictionary[char])

    if (replacement !== undefined) {
      value = value.slice(0, index) + replacement + value.slice(index + 1)

      const addedCharsCount = replacement.length - 1

      index += addedCharsCount
      length += addedCharsCount
    }
  }

  return value
}
