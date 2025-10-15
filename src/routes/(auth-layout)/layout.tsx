import { page, type AppPageContext, type PageRoutes } from "@/lib/page"
import { SimpleCenterPage } from "@/lib/page-templates"
import { Header } from "@/lib/primitives"
import { Logo } from "@/shared/logo"
import { ReactNode } from "react"

export function AuthPage(props: {
  children?: ReactNode,
  className?: string
}) {
  return <>
    <SimpleCenterPage>
      <Header className="items-center">
        <Logo />
      </Header>
      {props.children}
    </SimpleCenterPage>
  </>
}

export function authPage<R extends PageRoutes>(
  route: R,
  render: (context: AppPageContext<R>) => ReactNode,
  layout?: (children?: ReactNode) => ReactNode,
) {
  return page(route, render, children => <AuthPage>
    {layout ? layout(children) : children}
  </AuthPage>)
}