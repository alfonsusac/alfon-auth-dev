import { ActionButton } from "@/lib/formv2/form-component"
import { page } from "@/lib/page/page"
import { navigate } from "@/lib/navigate"
import { refresh } from "next/cache"
import { notFound } from "next/navigation"

// dev: http://localhost:3000/test-navigate

export default page('/test-navigate', async page => {
  if (process.env.NODE_ENV === 'production') notFound()
  const rng = Math.random()
  return (
    <div>
      <h1>Test Navigate Page</h1>
      <p>This is a test page for navigation.</p>
      <p>Random number: {rng}</p>

      <ActionButton
        action={async () => {
          "use server"
          return refresh()
        }}
        loading="Refreshing..."
      >
        return refresh()
      </ActionButton>
      <ActionButton
        action={async () => {
          "use server"
          navigate.replace('')
        }}
        loading="Refreshing..."
      >
        navigate.replace('')
      </ActionButton>
      <ActionButton
        action={async () => {
          "use server"
          navigate.replace('.')
        }}
        loading="Refreshing..."
      >
        navigate.replace('.')
      </ActionButton>
      <ActionButton
        action={async () => {
          "use server"
          navigate.replace('', { foo: 'bar/here' })
        }}
        loading="Refreshing..."
      >
        {`navigate.replace('&foo=bar/here')`}
      </ActionButton>


      Page: <br />
      <pre>
        {JSON.stringify(page, null, 2)}
      </pre>

      <ActionButton
        action={async () => {
          "use server"
          navigate.replace(page.pathQuery)
        }}
        loading="Refreshing..."
      >
        {`navigate.replace(page.pathQuery)`} {page.pathQuery}
      </ActionButton>

    </div>
  )
}).Page