import { meta } from "@/meta"

export default function SubLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-2 items-start text-sm">


      <div className="flex flex-col gap-8 w-full">
        {props.children}
      </div>

    </main>
  )
}