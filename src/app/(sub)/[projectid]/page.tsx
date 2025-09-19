import { data } from "@/data"

export default async function ProjectPage(props: {
  params: Promise<{ projectid: string }>
}) {
  const projectid = (await props.params).projectid
  const project = data.projects.find(p => p.id === projectid)

  if (!project) return <>
    <section>
      <h1 className="page-h1">Project Not Found</h1>
      <p className="text-pretty text-sm max-w-80 text-foreground-body">
        The project with ID "{projectid}" does not exist.
      </p>
    </section>

    <a href="/" className="button primary">{'<-'} Back to Home</a>
  </>

  return <>
    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="font-mono text-sm tracking-tight text-foreground-body">{projectid}</code>
    </header>
  </>

}