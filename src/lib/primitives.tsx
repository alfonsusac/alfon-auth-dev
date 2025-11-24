import { cn } from "lazy-cn"
import type { ComponentProps } from "react"

export function ListBase(props: ComponentProps<'ul'>) {
  return <ul {...props} className={cn("list", props.className)} />
}
export async function List<T>(
  props: Omit<ComponentProps<'ul'>, 'children'> & {
    values: T[] | Promise<T[]>,
    children: (item: T, index: number) => React.ReactNode,
    fallback?: React.ReactNode
  }
) {
  const { values, children, ...rest } = props
  const items = await values
  return <ListBase {...rest}>
    {items.length === 0 && <div className="list-empty ml-2 my-1">{props.fallback}</div>}
    {items.map((item, index) => <li key={index}>{props.children(item, index)}</li>)}
  </ListBase>
}

export async function ListItem(props: ComponentProps<'div'>) {
  return <div {...props} className={cn("relative group list-row", props.className)} />
}

export function SectionTitle(props: ComponentProps<'h2'>) {
  return <h2 {...props} className={cn("category-header lowercase after:content-['↓'] flex flex-row gap-3", props.className)} />
}

export function HelperText(props: ComponentProps<'p'>) {
  return <p {...props} className={cn("category-header text-xxs", props.className)} />
}



export function Group(props: ComponentProps<'div'>) {
  return <div {...props} className={cn("section flex flex-col gap-2.5", props.className)} />
}

export function Header(props: ComponentProps<'header'> & {
  tight?: boolean
}) {
  const { tight, ...rest } = props
  return <header {...rest} className={cn(
    "flex flex-col gap-2",
    props.tight && "gap-1",
    props.className)} />
}

export function Title(props: ComponentProps<'h1'>) {
  return <h1 {...props} className={cn('page-h1', props.className)} />
}

export function Row(props: ComponentProps<'div'> & {
  center?: boolean
}) {
  const { center, ...rest } = props
  return <div {...rest} className={cn(
    "flex flex-row gap-2 flex-wrap",
    center && "items-center",
    props.className)
  } />
}

export function CodeMessageHint(props: ComponentProps<'div'>) {
  return <div {...props} className={cn("text-foreground-body text-xxs font-mono", props.className)} />

}

export function Semibold(props: ComponentProps<'span'>) {
  return <span {...props} className={cn("font-semibold", props.className)} />
}

export function Section(props: ComponentProps<'section'> & {
  title?: React.ReactNode,
  description?: React.ReactNode
}) {
  const { title, description, ...rest } = props
  return <section {...rest} className={cn("section flex flex-col gap-2.5", props.className)}>
    {(props.title || props.description) && <header className="flex flex-col gap-0.5">
      {props.title && <SectionTitle>{props.title}</SectionTitle>}
      {props.description && <HelperText>{props.description}</HelperText>}
    </header>}
    {props.children}
  </section>
}