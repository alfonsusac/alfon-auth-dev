export function KeyNameInputField(props: {
  name: string
  defaultValue?: string | null
}) {
  return (
    <div className="input-group">
      <label className="label">key name</label>
      <p className="label-helper">Describe your project key to differentiate with other keys</p>
      <input name={props.name} className="input" defaultValue={props.defaultValue ?? ""} required placeholder="development / production" />
    </div>
  )
}

// export function KeyDomainInputField(props: {
//   name: string
//   defaultValue?: string | null
// }) {
//   return (
//     <div className="input-group">
//       <label className="label">domain</label>
//       <p className="label-helper">
//         The domain this key is allowed to be used from.
//       </p>
//       <div className="input flex gap-2 items-center">
//         <p className="text-foreground-body/50">https://</p>
//         <input name={props.name} className="grow" defaultValue={props.defaultValue ?? ""} required />
//       </div>
//     </div>
//   )
// }

// export function KeyCallbackURIInputField(props: {
//   name: string
//   defaultValue?: string | null
// }) {
//   return (
//     <div className="input-group">
//       <label className="label">callback URI</label>
//       <p className="label-helper">
//         The callback URI this key is allowed to be used from.
//       </p>
//       <div className="input flex gap-2 items-center">
//         <p className="text-foreground-body/50">https://</p>
//         <input name={props.name} className="grow" defaultValue={props.defaultValue ?? ""} required />
//       </div>
//     </div>
//   )
// }