import { isError } from "@/module/action/error"
import { createForm } from "@/lib/formv2/form"
import { createUserFromSession } from "@/services/user/logic"
import { validateAvatarUrl, validateUserName } from "@/services/user/validations"
import { getCurrentUserSessionProvider, type Session } from "@/shared/auth/auth"
import { navigate } from "@/module/navigation"

export const registerUserForm = (session: Session) => {
  return createForm({
    action: async input => {
      "use server"
      const session = await getCurrentUserSessionProvider()
      if (!session) return navigate.refresh()
      const name = validateUserName(input.name)
      if (isError(name)) return name
      const avatarUrl = validateAvatarUrl(input.avatarUrl)
      if (isError(avatarUrl)) return avatarUrl
      const res = await createUserFromSession(session, { name, avatarUrl })
      return res
    },
    fields: {
      name: {
        type: "text", required: true, autoFocus: true,
        label: "display name",
        helper: "your display name shown to others",
        placeholder: "John Doe",
        defaultValue: session?.providerInfo.name || '',
      },
      avatarUrl: {
        type: "text",
        label: "avatar URL",
        helper: "URL to your avatar image (optional)",
        placeholder: "https://example.com/avatar.jpg",
        defaultValue: session?.providerInfo.picture || '',
      }
    }
  })({
    errorMessages: {
      "avatar_invalid_fragment": "avatar URL contains invalid fragments.",
      "avatar_invalid_host": "avatar URL contains invalid host.",
      "avatar_invalid_path": "avatar URL contains invalid path.",
      "avatar_invalid_port": "avatar URL contains invalid port.",
      "avatar_invalid_protocol": "avatar URL contains invalid protocol.",
      "avatar_invalid_query": "avatar URL contains invalid query.",
      "avatar_missing_protocol": "avatar URL is missing protocol (e.g., https://).",
      "Name cannot be empty": "please provide a valid display name.",
      "Name cannot be longer than 100 characters": "display name is too long.",
    }
  })
}