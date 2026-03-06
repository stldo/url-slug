import { CAMELCASE_REGEXP_PATTERN } from "./helpers";
import type { Transformer } from "./transformers";

const REVERT = /[^-._~!$&'()*+,;=]+/g;

const REVERT_CAMELCASE = new RegExp(
  `[^-._~!$&'()*+,;=]*?${CAMELCASE_REGEXP_PATTERN}|[^-._~!$&'()*+,;=]+`,
  "g",
);

const REVERT_CAMELCASE_ONLY = new RegExp(
  `.*?${CAMELCASE_REGEXP_PATTERN}|.+`,
  "g",
);

export interface RevertOptions {
  camelCase?: boolean;
  separator?: string | null;
  transformer?: Transformer | null;
}

export default function revert(
  value: unknown,
  {
    camelCase = false,
    separator = null,
    transformer = null,
  }: RevertOptions = {},
): string {
  const string = String(value);
  let fragments: RegExpMatchArray | null;

  /* Determine which method will be used to split the slug */

  if (separator === "") {
    fragments = camelCase ? string.match(REVERT_CAMELCASE_ONLY) : [string];
  } else if (typeof separator === "string") {
    fragments = string.split(separator) as RegExpMatchArray;
  } else {
    fragments = string.match(camelCase ? REVERT_CAMELCASE : REVERT);
  }

  if (!fragments) {
    return "";
  }

  return transformer ? transformer(fragments, " ") : fragments.join(" ");
}
