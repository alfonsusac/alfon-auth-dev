import { getAllProjectKeysByProjectID } from "@/services/projects"
import { ProjectProp } from "../types"
import { CopyButton } from "@/lib/CopyButton"
import { DateTime } from "@/lib/date.ui"
import { searchParams } from "@/lib/page"
import { List } from "@/lib/primitives"
import { Modal } from "@/lib/dialogsv2/modal"
import { SubpageOverlay } from "@/lib/dialogsv2/dialog.templates"
import { ProjectKeySubpage } from "./project-key-subpage"

export async function ProjectKeysList({ project }:
  & ProjectProp
) {
  const project_keys = await getAllProjectKeysByProjectID(project.id)

  return (
    <List val={project_keys} fallback="No API keys present">
      {key =>
        <li className="relative group" key={key.id}>
          <div className="absolute top-1 right-1">
            <CopyButton text={key.client_secret} className="button small floating opacity-0 group-hover:opacity-100">
              copy
            </CopyButton>
          </div>
          <Modal
            name={"key_" + key.id}
            button={Button =>
              <Button>
                <button className="list-row">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="text-foreground-body font-semibold leading-3 text-xs">
                      🔑 {key.name}
                      <span className="text-foreground-body/75 font-normal leading-3 text-xs">
                        {' - '}<DateTime date={key.createdAt} />
                      </span>
                    </div>
                    <div className="text-foreground-body/75 font-mono leading-3 text-xs rounded-sm truncate min-w-0">
                      {key.client_secret}
                    </div>
                  </div>
                </button>
              </Button>
            }
            content={modal => <>
              <SubpageOverlay>
                <ProjectKeySubpage
                  context={{ [`key_${ key.id }`]: '' }}
                  project={project}
                  projectKey={key}
                />
              </SubpageOverlay>
            </>}
          />
        </li>
      }
    </List>
  )
}
