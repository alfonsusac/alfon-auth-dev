import { revalidateTag, unstable_cache } from "next/cache"
import { cache } from "react"


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


  // const revalidateFn = (...i: I) => {
  //   const tempTag: string | string[] = typeof tag === "function" ? tag(...i) : tag
  //   const resolvedTags = Array.isArray(tempTag) ? tempTag : [tempTag]
  //   const joinedTag = resolvedTags.join("-") + fn.name
  //   revalidateTag(joinedTag)
  // }


}

async function add2(val: number) {
  return val + 2
}

// const [a, b] = datacache(add2, (val) => `add2`)


type JSONables = string | number | boolean | null | { [key: string]: JSONables } | JSONables[]