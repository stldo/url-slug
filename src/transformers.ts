export type Transformer = (fragments: string[], separator: string) => string;

export const LOWERCASE_TRANSFORMER: Transformer = (fragments, separator) =>
  fragments.join(separator).toLowerCase();

export const SENTENCECASE_TRANSFORMER: Transformer = (fragments, separator) => {
  const sentence = fragments.join(separator);

  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
};

export const TITLECASE_TRANSFORMER: Transformer = (fragments, separator) => {
  const buffer: string[] = [];

  for (let index = 0; index < fragments.length; index++) {
    buffer.push(
      fragments[index].charAt(0).toUpperCase() +
        fragments[index].slice(1).toLowerCase(),
    );
  }

  return buffer.join(separator);
};

export const UPPERCASE_TRANSFORMER: Transformer = (fragments, separator) =>
  fragments.join(separator).toUpperCase();
