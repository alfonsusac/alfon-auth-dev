import { Section, Title } from "@/lib/primitives"
import type { ParsedURLError } from "@/lib/url/url"


function ErrorUI(
  title: string,
  description: string,
  errorMessage?: string
) {
  return <>
    <Section>
      <Title>{title}</Title>
      <div>
        {description}
      </div>
      {errorMessage && <div className="text-foreground-body text-xxs font-mono mt-4">
        {errorMessage}
      </div>}
    </Section>
  </>
}



export function AuthorizeProjectNotFoundContent(props: {
  projectid: string
}) {
  return ErrorUI(
    "The project you are trying to access does not exist!",
    "Try contacting the developer of the website for more information.",
    `project with id "${ props.projectid }" not found`
  )
}

export function AuthorizePageInvalidParameter(props: { urlerror?: ParsedURLError, message?: string }) {
  return ErrorUI(
    "The developer of that website set up something wrong!",
    "Try contacting the developer of that website for more information.",
    [props.urlerror && parsedUrlErrorErrorMessages[props.urlerror], props.message].join(', ')
  )
}

const parsedUrlErrorErrorMessages: Record<ParsedURLError, string> = {
  "new_url()_requires_a_protocol": "new URL() requires a protocol",
  invalid_protocol: "invalid protocol",
  invalid_host: "invalid host",
  invalid_port: "invalid port",
  invalid_path: "invalid path",
  invalid_query: "invalid query",
}