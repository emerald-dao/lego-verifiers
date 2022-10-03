import { useState } from "react";
import RoleVerifierCreatorSlideOver from "./RoleVerifierCreatorSlideOver";
import RoleView from "./RoleView";



export default function MultiRolesView(props) {
  const {roleVerifiers, setRoleVerifiers} = props
  const [open, setOpen] = useState(false)
  const [newRoleVerifier, setNewRoleVerifier] = useState(null)

  return (
    <div className="flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Role Verifiers
      </label>
      <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 auto-rows-fr">
        {
          roleVerifiers.map((role) => {
            return (
              <RoleView />
            )
          })
        }
        <button className="
            h-36 p-4 shrink-0
            shadow-lg bg-white
            ring-1 ring-black ring-opacity-5 rounded-2xl 
            flex flex-col gap-y-4 border-4 border-emerald border-dashed"
          onClick={() => {
            setOpen(!open)
          }}
          >

          New
        </button>
      </div>
      <RoleVerifierCreatorSlideOver
        open={open}
        setOpen={setOpen}
        setNewRoleVerifier={setNewRoleVerifier}
      />
    </div>
  )
}