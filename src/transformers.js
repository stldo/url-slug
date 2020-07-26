export const LOWERCASE_TRANSFORMER = function (fragments, separator) {
  return fragments.join(separator).toLowerCase()
}

export const SENTENCECASE_TRANSFORMER = function (fragments, separator) {
  const sentence = fragments.join(separator)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
}

export const TITLECASE_TRANSFORMER = function (fragments, separator) {
  const buffer = []
  for (let index = 0; index < fragments.length; index++) {
    buffer.push(
      fragments[index].charAt(0).toUpperCase() +
      fragments[index].slice(1).toLowerCase()
    )
  }
  return buffer.join(separator)
}

export const UPPERCASE_TRANSFORMER = function (fragments, separator) {
  return fragments.join(separator).toUpperCase()
}
