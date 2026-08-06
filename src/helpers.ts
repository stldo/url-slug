export type Dictionary = Record<string, string>;

export const CAMELCASE_REGEXP_PATTERN =
  "(?:[a-z](?=[A-Z])|[A-Z](?=[A-Z][a-z]))";

export function replace(value: string, dictionary: Dictionary): string {
  let result = value;

  for (let index = 0, length = result.length; index < length; index++) {
    const char = result[index];
    const replacement = dictionary[char];

    if (replacement !== undefined) {
      result = result.slice(0, index) + replacement + result.slice(index + 1);

      const addedCharsCount = replacement.length - 1;

      index += addedCharsCount;
      length += addedCharsCount;
    }
  }

  return result;
}
