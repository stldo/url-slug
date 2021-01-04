declare type Options = {
  camelCase?: boolean
  dictionary?: object
  separator?: string
  transformer?: false | Transformer
}

declare type RevertOptions = Omit<Options, 'separator'> & {
  separator?: null | string
}

declare type Transformer = (fragments: string[], separator: string) => string

/**
 * Builtin transformers
 */

export declare const LOWERCASE_TRANSFORMER: Transformer
export declare const SENTENCECASE_TRANSFORMER: Transformer
export declare const TITLECASE_TRANSFORMER: Transformer
export declare const UPPERCASE_TRANSFORMER: Transformer

/**
 * Converts a string into a slug
 */

export declare function convert(string: string, options?: Options): string

/**
 * Reverts a slug back to a string
 */

export declare function revert(slug: string, options?: RevertOptions): string

/**
 * Sets convert() as the default export
 */

export default convert
