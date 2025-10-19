import { page } from "@/lib/page"
import { notFound, unauthorized } from "next/navigation"
import { Suspense } from "react"

export default page('/test-navigate', async page => {
  if (process.env.NODE_ENV === 'production') notFound()
  
  // throw "hello"

  notFound() // returns 404, renders /not-fonud, path stays /test-navigate

  const rng = Math.random()
  return (
    <div>
      {/* <Suspense>
        <Component />
      </Suspense> */}
      <h1>Test Error Page</h1>
      <p>This is a test page for Error.</p>
      <p>Random number: {rng}</p>
    </div>
  )
}).Page


export async function Component() {
  await new Promise(resolve => setTimeout(resolve, 10000))

  notFound()

  return <>
  </>
}