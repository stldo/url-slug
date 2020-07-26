export const LOWERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toLowerCase()
}

export const SENTENCECASE_TRANSFORMER = (fragments, separator) => {
  const sentence = fragments.join(separator)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
}

export const TITLECASE_TRANSFORMER = (fragments, separator) => {
  const buffer = []
  for (const fragment of fragments) {
    buffer.push(
      fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase()
    )
  }
  return buffer.join(separator)
}

export const UPPERCASE_TRANSFORMER = (fragments, separator) => {
  return fragments.join(separator).toUpperCase()
}
