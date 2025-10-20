import { Link } from "./link/Linkss"

export default function BackButton(props: {
  href: string,
  children?: React.ReactNode
}) {
  return (
    <Link {...props} className="block -mx-3 px-3 button ghost" scroll={false}>
      {'<-'} <span className="tracking-tight font-medium">{props.children}</span>
    </Link>
  )
}