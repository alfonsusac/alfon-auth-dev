// its literally just branded tagging stuff

export type PseudoClass<T, N extends string> = T & { [`__type-only`]: N }