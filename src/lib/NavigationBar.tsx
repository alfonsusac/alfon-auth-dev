import BackButton from "./BackButton"

export function NavigationBar(props: {
  back: {
    href: string
    label: string
  }
  title?: string
}) {
  return (
    <>
      <div className="sticky top-0 h-(--header-h) z-(--z-navbar-sticky) contain-layout">
        <div className="absolute w-[99999px] h-screen backdrop-blur-xs bg-background/95 this-is-header-color -translate-x-[100vw] -translate-y-full top-full" />
        <div className="absolute inset-0 flex h-full items-center">
          <div>
            <BackButton href={props.back?.href}>
              {props.back.label}
            </BackButton>
          </div>
        </div>
      </div>
      <div className="fixed top-0 w-full left-0 z-10 z-(--z-navbar-fixed) pointer-events-none">
        <div className="w-full h-[calc(var(--header-h)_*_1.5)] bg-gradient-to-b from-blue-950/10 via-blue-900/10 reveal-on-scroll" />
      </div>
    </>
  )
} 