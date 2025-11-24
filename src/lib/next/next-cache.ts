import { unstable_cache, updateTag } from "next/cache"
import { cache } from "react"

export function taggeddatacache<
  I extends JSONables[],
  O extends JSONables,
  // T extends ()[] | string | string[] | ((...i: I) => (string | string[]))
  T extends string | string[] | ((...i: I) => (string | string[]))
>(
  fn: (...args: I) => Promise<O>,
  tag: T,
) {
  const cachedFn = datacache(fn, tag)

  const update = (() => {
    if (typeof tag === "string") {
      return () => updateTag(tag)
    } else
      if (Array.isArray(tag)) {
        return () => updateTag(tag[0])
      } else {
        const tagfn = tag as T & ((...i: I) => (string | string[]))
        return (...args: Parameters<typeof tagfn>) => {
          const tags = tagfn(...args)
          const resolvedTags = Array.isArray(tags) ? tags : [tags]
          resolvedTags.forEach(t => updateTag(t))
        }
      }

  })()
  return [cachedFn, update] as const
}



// Base

type JSONables = string | number | boolean | null | { [key: string]: JSONables } | JSONables[]
type Tags<I extends JSONables[]> = string | string[] | ((...i: I) => (string | string[]))
type TagsParameter<I extends JSONables[], T extends Tags<I>> = T extends ((...i: I) => (string | string[])) ? Parameters<T> : []
type DataCachedFn<
  I extends JSONables[],
  O extends JSONables,
  T extends Tags<I>
> = {
  (...args: I): Promise<O>,
  revalidate: (...args: TagsParameter<I, T>) => void
  }
type AnyDataCachedFn = DataCachedFn<JSONables[], JSONables, Tags<JSONables[]>>

export function datacache<
  I extends JSONables[],
  O extends JSONables,
  T extends Tags<I>
>(
  fn: (...args: I) => Promise<O>,
  tag: T,
): DataCachedFn<I, O, T> {
  const cachedFn = cache(
    (...args: I) => {
      const tempTag: string | string[] = typeof tag === "function" ? tag(...args) : tag
      const resolvedTags = Array.isArray(tempTag) ? tempTag : [tempTag]
      return unstable_cache(fn, undefined, {
        tags: resolvedTags
      })(...args)
    }
  )

  const resolvedTagsFn = (() => {
    if (typeof tag === 'string')
      return () => updateTag(tag)

    if (typeof tag === 'function')
      return (...args: TagsParameter<I, T>) => {
        const tempTag = tag(...args as I)
        const resolvedTags = Array.isArray(tempTag) ? tempTag[0] : tempTag
        updateTag(resolvedTags)
      }

    if (Array.isArray(tag))
      return () => updateTag(tag[0])

    throw new Error('Invalid tag type')
  })()

  const datacachedFn = Object.assign(cachedFn, {
    revalidate: resolvedTagsFn
  })

  return datacachedFn
}


export function revalidate(fn: AnyDataCachedFn | AnyDataCachedFn[]) {
  if (Array.isArray(fn)) {
    fn.forEach(f => f.revalidate())
  } else {
    fn.revalidate()
  }
}


/// test

// const getSomething = datacache(async (a: string, b: string) => {
//   return ""
// })

// type Result<A extends JSONables> = {
//   a: A
// }

// function makeResult<R extends Result<JSONables>>(opts: {
//   r: R
// }) {
//   return {}
// }

// const myResult = makeResult({
//   r: {
//     a: 2
//   }
// })