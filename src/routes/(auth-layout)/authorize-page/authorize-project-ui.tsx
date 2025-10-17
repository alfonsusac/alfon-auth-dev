import { ActionButton } from "@/lib/formv2/form-component"
import { Header, Row, Section, Title } from "@/lib/primitives"
import { Spacer } from "@/lib/spacer"
import { LogOutButton } from "@/shared/auth/login-button"
import { IconRight } from "@/shared/icons"
import { LogoIcon } from "@/shared/logo"

export function AuthorizeProjectUI(props:
  & { project: & { name: string } }
  & { user: { name: string, picture?: string } }
  & { onAuthorize: () => Promise<void> }
  & { onDeny: () => Promise<void> }
) {
  return <>
    <div className="p-8 rounded-2xl bg-foreground-muted/10 max-w-80 gap-0">
      <Header>
        <div className="self-center flex gap-3 items-center">
          <LogoIcon className="size-10 -mx-1" />
          <IconRight className="opacity-50" />
          {/* Project Icon */}
          <div className="self-center block size-10 rounded-full bg-blue-500/25 shrink-0" />
        </div>
        <Title className="font-medium leading-relaxed text-lg font-semibold">
          {props.project.name} <br />
        </Title>
        <span className="text-xs -mt-2.5">
          wants to access your alfon.dev account
        </span>
      </Header>

      <Spacer half />

      <div className="w-full text-start">
        <Section className="text-xs text-pretty gap-1.5 w-full text-start">
          <div className="">
            {props.project.name} is requesting permission for
          </div>
          {/* Later: Get permissions from scope */}
          <ul className="list-disc pl-4 flex flex-col gap-2 my-2">
            <li>
              <div className="font-semibold">Identification</div>
              <div>Use your alfon.dev account to identify you</div>
            </li>
            <li>
              <div className="font-semibold">Profile Info</div>
              <div>View your basic profile info (name, email, profile picture)</div>
            </li>
          </ul>
        </Section>
      </div>

      <Spacer half />

      <Row className="-mx-4 -mb-4">
        <ActionButton
          action={props.onDeny}
          loading={"Denying..."}
          className="small flex-1 w-full"
        >
          Deny
        </ActionButton>
        <ActionButton
          action={props.onAuthorize}
          loading={"Authorizing..."}
          className="small flex-1 w-full primary"
        >
          Authorize
        </ActionButton>
      </Row>
    </div>

    <Section className="p-4 pr-7 rounded-xl bg-foreground-muted/10 -mt-6 gap-4 max-w-80 w-full">
      <Row className="text-xs items-center text-start ">
        {/* Avatar */}
        <div className="size-6 bg-blue-500/50 rounded-full relative">
          <img src={props.user.picture} alt={props.user.name} className="absolute inset-0 rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="leading-tight">
            signed in as
          </span>
          <div className="flex gap-1 items-center">
            <div className="font-semibold">{props.user.name}</div>
          </div>
        </div>
      </Row>
      <LogOutButton className="small w-full" />
    </Section>


  </>
}