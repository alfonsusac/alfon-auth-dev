import { createContext, use } from "react"

export function reactContext<T>() {
  const context = createContext(null as null | T)
  return {
    Provider: context.Provider,
    use: () => {
      const ctx = use(context)
      if (!ctx) throw new Error("Context value is null, make sure to use the Provider")
      return ctx
    },
    context: context
  }
}






