// Extract strings from a union of things
export type ErrorMessages<R> = { [key in R extends infer RR ? RR extends string ? RR : never : never]: string }

// Extract non string stuffs from a union of things
export type ResolvedResult<R> = R extends string ? never : R