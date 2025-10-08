
export default function SubLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-2 items-stretch text-sm">
      
      <div className="flex flex-col max-w-120">
        {props.children}
      </div>

    </main>
  )
}