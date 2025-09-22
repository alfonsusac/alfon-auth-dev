export function KeyNameInputField(props: {
  name: string
  defaultValue?: string | null
}) {
  return (
    <div className="input-group">
      <label className="label">key name</label>
      <p className="label-helper">Describe your project key to differentiate with other keys</p>
      <input name={props.name} className="input small" defaultValue={props.defaultValue ?? ""} required placeholder="development / production" />
    </div>
  )
}
