import { meta } from "@/meta"

export default function SubLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-2 items-start text-sm">
      <a href="/" className="block -mx-3 px-3 button ghost">
        {'<-'} <span className="tracking-tight font-medium">Home</span>
      </a>

      <div className="flex flex-col gap-8">
        {props.children}
      </div>

    </main>
  )
}