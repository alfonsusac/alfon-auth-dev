
export async function wrapper(cb: () => string) {
  return cb()
}

export function test() {
  return async () => {
    "use server"
    return "hello"
  }
}