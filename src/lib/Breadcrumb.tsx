export function Breadcrumb(props: { items: string[] }) {
  return (
    <div className="breadcrumb">
      {props.items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <p>{item}</p>
          {index < props.items.length - 1 && <p>{'>'}</p>}
        </span>
      ))}
    </div>
  )
}