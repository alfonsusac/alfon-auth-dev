import { cn } from "lazy-cn"
import type { ComponentProps } from "react"

export function ListBase(props: ComponentProps<'ul'>) {
  return <ul {...props} className={cn("list", props.className)} />
}
export function List<T>(
  props: Omit<ComponentProps<'ul'>, 'children'> & {
    val: T[],
    children: (item: T, index: number) => React.ReactNode,
    fallback?: React.ReactNode
  }
) {
  const { val, children, ...rest } = props
  return <ListBase {...rest}>
    {val.length === 0 && <div className="list-empty">{props.fallback}</div>}
    {props.val.map((item, index) => props.children(item, index))}
  </ListBase>
}

export function SectionTitle(props: ComponentProps<'h2'>) {
  return <h2 {...props} className={cn("category-header lowercase after:content-['↓'] flex flex-row gap-3", props.className)} />
}

export function HelperText(props: ComponentProps<'p'>) {
  return <p {...props} className={cn("category-header text-xxs", props.className)} />
}

export function Section(props: ComponentProps<'section'>) {
  return <section {...props} className={cn("section flex flex-col gap-2.5", props.className)} />
}

export function Header(props: ComponentProps<'header'>) {
  return <header {...props} className={cn("flex flex-col gap-1", props.className)} />
}

export function Title(props: ComponentProps<'h1'>) {
  return <h1 {...props} className={cn('page-h1 mb-4', props.className)} />
}