
export default function SubLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-2 items-stretch text-sm">
      
      <div className="flex flex-col gap-8">
        {props.children}
      </div>

    </main>
  )
}