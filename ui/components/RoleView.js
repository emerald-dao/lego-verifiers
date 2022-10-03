export default function RoleView(props) {
  const { roleVerifier } = props
  return (
    <div className="
    h-36 p-4 shrink-0
    shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-4 
    ">
      <label>RoleID: {roleVerifier.roleID}</label>
      <label>Logic: {roleVerifier.basicVerifiersLogic}</label>
      <label>basicVerifiers: {roleVerifier.basicVerifiers.length}</label>
    </div>
  )
}