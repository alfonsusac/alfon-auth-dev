export default function BackButton(props: {
  href: string,
  children?: React.ReactNode
}) {
  return (
    <a {...props} className="block -mx-3 px-3 button ghost" >
      {'<-'} <span className="tracking-tight font-medium">{props.children}</span>
    </a>
  )
}