import { revalidateTag, unstable_cache, updateTag } from "next/cache"
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

export function datacache<
  I extends JSONables[],
  O extends JSONables,
  // T extends ()[] | string | string[] | ((...i: I) => (string | string[]))
  T extends string | string[] | ((...i: I) => (string | string[]))
>(
  fn: (...args: I) => Promise<O>,
  tag: T,
) {
  const id = fn.name

  const cachedFn = cache(
    (...args: I) => {
      const tempTag: string | string[] = typeof tag === "function" ? tag(...args) : tag
      const resolvedTags = Array.isArray(tempTag) ? tempTag : [tempTag]

      return unstable_cache(fn, undefined, {
        tags: resolvedTags
      })(...args)

    }
  )

  Object.assign(cachedFn, {
    __datacache_id: fn.name + fn.toString()
  })


  return cachedFn
}

type JSONables = string | number | boolean | null | { [key: string]: JSONables } | JSONables[]