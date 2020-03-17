declare type Transformer = (fragments: string[], separator: string) => string;
declare type Options = {
  camelCase?: boolean;
  separator?: string;
  transformer?: false | Transformer;
};
/**
 * Builtin transformers
 */
export declare const LOWERCASE_TRANSFORMER: (fragments: string[], separator: string) => string;
export declare const SENTENCECASE_TRANSFORMER: (fragments: string[], separator: string) => string;
export declare const TITLECASE_TRANSFORMER: (fragments: string[], separator: string) => string;
export declare const UPPERCASE_TRANSFORMER: (fragments: string[], separator: string) => string;
/**
 * Converts a string into a slug
 */
export declare function convert(string: string, options?: Options): string;
/**
 * Reverts a slug back to a string
 */
export declare function revert(slug: string, options?: Options): string;
/**
 * Sets convert() as the default export
 */
export default convert;
