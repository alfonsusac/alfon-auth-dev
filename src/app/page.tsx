export default function Home() {
  return (
    <div className="font-sans flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20">

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Alfon's Auth Place
        </h1>
        <p className="text-pretty text-sm max-w-80 text-foreground-body">
          A simple authentication wrapper for all my side projects.
        </p>
      </header>

      <form className="flex flex-col gap-2 items-start">
        <p className="text-pretty text-sm text-foreground-body">manage your accounts ↓</p>
        <button className="button primary">Login via Google</button>
      </form>

    </div>
  );
}
