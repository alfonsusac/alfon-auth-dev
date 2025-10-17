import { page } from "@/lib/page"
import { notFound, unauthorized } from "next/navigation"

export default page('/test-navigate', async page => {
  if (process.env.NODE_ENV === 'production') notFound()

  // notFound() // returns 404, renders /not-fonud, path stays /test-navigate

  // try {
  //   notFound()
  // } catch (error) {
  //   const digest = ( error as any ).digest as string
  //   console.log(digest);
  //   ((error as any).digest as string) = digest.replace('404', '422')
  //   throw error
  // }
  // notFound()


  const rng = Math.random()
  return (
    <div>
      <h1>Test Error Page</h1>
      <p>This is a test page for Error.</p>
      <p>Random number: {rng}</p>
    </div>
  )
}).Page