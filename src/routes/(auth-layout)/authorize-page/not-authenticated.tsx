import { Header, Section, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import { route } from "@/routes/routes"
import type { ProjectProp } from "@/routes/types"
import { LogInViaGoogleButton } from "@/shared/auth/login-button"
import type { SVGProps } from "react"

export function AuthorizeProjectNotAuthenticated(props: ProjectProp) {
  return (
    <>
      <Section className="p-8 rounded-2xl bg-foreground-muted/10 max-w-80 gap-0">

        <Header>

          <div className="self-center block size-10 rounded-full bg-blue-500/25 shrink-0" />
          <Spacer quarter />
          <Title className="text-base font-medium leading-relaxed text-lg font-semibold">
            Sign in to continue to{' '}
            <div className="text-xl font-semibold flex justify-center gap-1.5 items-center">
              Acme
            </div>
          </Title>

          <div className="text-xs text-pretty flex flex-col gap-1.5">
            <p>
              Welcome to auth.alfon.dev.
            </p>
            <p>
              Use your alfon.dev account to<br /> securely access any of my projects.
            </p>
            <Spacer quarter />
          </div>
        </Header>

        <Spacer half />

        <LogInViaGoogleButton
          withLogo
          fullWidth
          redirectTo={route.authorizePage(props.project.id)}
          className="flex-2"
        >
          Continue via Google
        </LogInViaGoogleButton>

        <Spacer half />

        <div className="text-xxs text-pretty">
          We’ll check if your account exists first — no data is stored until you confirm.
        </div>

        <Spacer quarter />

      </Section>
    </>
  )
}


export function MaterialSymbolsCheckRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" /></svg>
  )
}