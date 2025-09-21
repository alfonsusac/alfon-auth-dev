import { getCurrentUser, adminOnly, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { ProjectNotFound } from "./shared"
import { SPCallout } from "@/lib/SPCallout"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"
import { formatDate } from "@/lib/date"
import { navigate } from "@/lib/resolveAction"
import { getAllProjectKeys, getProject, updateProject } from "@/services/projects"
import { getStringInputs } from "@/lib/formData"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const projectid = (await props.params).projectid
  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const user = await getCurrentUser()

  return <>
    <BackButton href="/">Home</BackButton>

    <SPCallout sp={props.searchParams} match="info=new" className="success">project created successfully!</SPCallout>
    <SPCallout sp={props.searchParams} match="info=key_deleted" className="success">key deleted successfully!</SPCallout>
    <SPCallout sp={props.searchParams} match="info=updated" className="success">project updated!</SPCallout>

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        auth.alfon.dev/{projectid}
      </code>
    </header>

    {
      isAdmin(user) &&
      <>
        <section className="category">
          <p className="category-title">edit details ↓</p>
          <hr />
          <form className="flex flex-col gap-6"
            action={async (form: FormData) => {
              "use server"
              await adminOnly(`/${ projectid }`)
              const inputs = getStringInputs(form, ["name", "id"])
              const res = await updateProject(inputs, project.id)
              resolveError(`/${ projectid }`, res)
              revalidatePath(`/${ projectid }`, 'layout')
              navigate(`?info=updated`)
            }}
          >

            <section className="flex flex-col gap-2">
              <div className="input-group">
                <label className="label">project name</label>
                <p className="label-helper">give your project a name for better identification</p>
                <input name="name" className="input" defaultValue={project.name} />
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <div className="input-group">
                <label className="label">project id</label>
                <p className="label-helper">
                  the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.
                </p>
                <div className="input flex gap-2 items-center">
                  <p className="text-foreground-body/50">https://auth.alfon.dev/</p>
                  <input name="domain" className="grow" defaultValue={project.id ?? ""} />
                </div>
              </div>
            </section>
            <FormButton className="button primary px-6 self-end"
              loading="Saving..."
            >Save</FormButton>
          </form>
        </section>

        <ProjectKeysList projectid={projectid} />

        <section className="category">
          <p className="category-title">api references ↓</p>
          <hr />
          <div className="flex flex-col gap-2">
            <div className="card">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <div className="font-mono font-semibold leading-3">
                    GET /authorize
                  </div>
                  <div className="font-mono text-xs leading-3 tracking-tight text-foreground-body">
                    auth.alfon.dev/{projectid}/authorize
                  </div>
                </div>
                <p className="text-xs text-foreground-body">
                  Redirects to the OAuth provider for authentication. Requires an API key in the Authorization header.
                </p>
                <div className="flex gap-2">
                  <button className="button small">
                    Copy URL
                  </button>
                  <a className="button small" href={`/${ projectid }/login`}>
                    Log In to Project
                  </a>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex flex-col gap-1">
                <div className="font-mono font-semibold">
                  POST /token
                </div>
                <p className="text-xs text-foreground-body">
                  Exchanges an authorization code for an access token. Requires an API key in the Authorization header.
                </p>
                <button className="button small mt-2">
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="category">
          <p className="category-title">danger zone ↓</p>
          <hr />
          <a className="button destructive" href={`/${ projectid }/delete`}>
            Delete Project
          </a>
        </section>
      </>
    }

  </>

}

async function ProjectKeysList(props: { projectid: string }) {
  const { projectid } = props
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const ProjectKeys = await getAllProjectKeys(projectid)
  return (
    <section className="category">
      <p className="category-title">project keys ↓</p>
      <hr />
      <ul className="flex flex-col gap-px -ml-3 -mt-3">
        {ProjectKeys.map((key) => <li key={key.id}>
          <a href={`/${ projectid }/key/${ key.id }`} className="button ghost flex flex-row py-3">
            <div className="flex flex-col items-start gap-1 grow min-w-0">
              <div className="text-foreground-body font-semibold leading-3 text-xs">
                {key.name}
              </div>
              <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0 w-full">
                {key.client_secret}
              </div>
              <div className="text-foreground-body/75 leading-3 text-xs">
                {formatDate(key.createdAt)}
              </div>
            </div>
          </a>
        </li>)}
        <a className="button list" href={`/${ projectid }/key/create`}>
          <div>+</div>
          <div>Create API Key</div>
        </a>
      </ul>
    </section>
  )
}