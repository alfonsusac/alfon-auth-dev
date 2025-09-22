import { getCurrentUser, adminOnly, isAdmin } from "@/lib/auth"
import BackButton from "@/lib/BackButton"
import { ProjectNotFound } from "./shared"
import { SPCallout } from "@/lib/SPCallout"
import { FormButton } from "@/lib/FormButton"
import { resolveError } from "@/lib/redirects"
import { revalidatePath } from "next/cache"
import { formatDate } from "@/lib/date"
import { navigate } from "@/lib/resolveAction"
import { getAllProjectDomains, getAllProjectKeys, getProject, updateProject } from "@/services/projects"
import { getStringInputs } from "@/lib/formData"
import { Form } from "@/lib/Form"
import { CopyButton } from "@/lib/CopyButton"

export default async function ProjectPage(props: PageProps<"/[projectid]">) {

  const projectid = (await props.params).projectid
  const project = await getProject(projectid)
  if (!project) return <ProjectNotFound id={projectid} />

  const user = await getCurrentUser()

  return <>
    <BackButton href="/">Home</BackButton>



    <SPCallout sp={props.searchParams} match="info=new" className="success">project created successfully!</SPCallout>
    <SPCallout sp={props.searchParams} match="info=key_deleted" className="success">key deleted successfully!</SPCallout>

    <header>
      <h1 className="page-h1">{project.name}</h1>
      <code className="page-subtitle-code">
        auth.alfon.dev/{projectid}
      </code>
    </header>

    <SPCallout sp={props.searchParams} match="info=updated" className="success">project updated!</SPCallout>

    {
      isAdmin(user) &&
      <>
        <section className="category">
          <p className="category-title">edit details ↓</p>
          {/* <hr /> */}
          <Form className="flex flex-col gap-6"
            action={async (form: FormData) => {
              "use server"
              await adminOnly(`/${ projectid }`)
              const inputs = getStringInputs(form, ["name", "id"])
              const res = await updateProject(inputs, project.id)
              resolveError(`/${ projectid }`, res)
              revalidatePath(`/${ projectid }`, 'layout')
              navigate(`/${ inputs.id }?info=updated`)
            }}
          >

            <section className="flex flex-col gap-2">
              <div className="input-group">
                <label className="label">project name</label>
                <p className="label-helper">give your project a name for identification</p>
                <input name="name" className="input small" defaultValue={project.name} required />
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <div className="input-group">
                <label className="label">project id</label>
                <p className="label-helper">
                  the unique identifier for your project that will be used as the client_id. changing this will affect all existing integrations.
                </p>
                <div className="input small as-box">
                  <p className="text-foreground-body/50">https://auth.alfon.dev/</p>
                  <input name="id" className="grow" defaultValue={project.id ?? ""} required />
                </div>
              </div>
            </section>
            <FormButton className="button primary px-6 self-end small"
              loading="Saving..."
            >Save</FormButton>
          </Form>
        </section>

        <ProjectDomainsList projectid={projectid} />

        <ProjectKeysList projectid={projectid} />

        <section className="category">
          <p className="category-title">api references ↓</p>
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
          {/* <hr /> */}
          <a className="button destructive" href={`/${ projectid }/delete`}>
            Delete Project
          </a>
        </section>
      </>
    }


  </>

}


async function ProjectDomainsList(props: { projectid: string }) {
  const { projectid } = props
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const domains = await getAllProjectDomains(projectid)
  return (
    <section className="category">
      <div className="category-title">
        authorized domains ↓
        <p className="text-xxs">
          these domains are authorized to redirect to after authentication.
        </p>
      </div>
      {/* <hr /> */}
      <ul className="flex flex-col gap-px -ml-3 -mt-3">
        {domains.map(domain => <li key={domain.id}>
          <a className="button ghost flex flex-row py-3">
            <div className="text-foreground-body font-semibold leading-3 text-xs">
              {domain.redirect_url}
            </div>
            <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0 w-full">
              {domain.redirect_url}
            </div>
            <div className="text-foreground-body/75 leading-3 text-xs">
              {formatDate(domain.createdAt)}
            </div>
          </a>
        </li>)}
      </ul>
    </section>
  )
}


async function ProjectKeysList(props: { projectid: string }) {
  const { projectid } = props
  const user = await getCurrentUser()
  if (!isAdmin(user)) return null
  const project_keys = await getAllProjectKeys(projectid)
  return (
    <section className="category">
      <div className="category-title">
        project keys ↓
      </div>
      <p className="category-title text-xxs">
        you can create multiple keys for different environments (e.g. development, staging, production).
        this will be used to validate requests to /token endpoints.
      </p>

      <ul className="list">
        {project_keys.map((key) => <li key={key.id} className="relative">
          <a href={`/${ projectid }/key/${ key.id }`} className="list-row">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="text-foreground-body font-semibold leading-3 text-xs">
                🔑 {key.name}
                <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                  {' - '}{formatDate(key.createdAt)}
                </span>
              </div>
              <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0 w-full">
                {key.client_secret}
              </div>
            </div>
          </a>
          <div className="absolute top-1 right-1">
            <CopyButton text={key.client_secret} className="button small floating">
              copy
            </CopyButton>
          </div>
        </li>)}
      </ul>

      <a className="button primary small -mt-1" href={`/${ projectid }/key/create`}>
        <div>Create API Key</div>
      </a>
    </section>
  )
}