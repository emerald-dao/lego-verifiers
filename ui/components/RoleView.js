import { XCircleIcon } from "@heroicons/react/outline"

export default function RoleView(props) {
  const { index, roleVerifier, deleteRoleVerifier } = props
  return (
    <div className="
    h-48 p-4 shrink-0
    shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-4 
    ">
      <div className="flex justify-end">
        <button
          onClick={() => {
            deleteRoleVerifier(index)
          }}
        >
          <XCircleIcon
            className="text-emerald hover:text-emerald-dark"
            width={32} height={32}
          />
        </button>
      </div>
      <label>RoleID: {roleVerifier.roleID}</label>
      <label>Logic: {roleVerifier.basicVerifiersLogic}</label>
      <label>basicVerifiers: {roleVerifier.basicVerifiers.length}</label>
    </div>
  )
}