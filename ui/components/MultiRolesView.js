import { useState } from "react";
import { generateScript } from "../lib/utils";
import RoleVerifierCreatorSlideOver from "./RoleVerifierCreatorSlideOver";
import RoleView from "./RoleView";



export default function MultiRolesView(props) {
  const {roleVerifiers, setRoleVerifiers} = props
  const [open, setOpen] = useState(false)

  const createNewRoleVerifier = (roleID, basicVerifiersLogic, basicVerifiers) => {
    setRoleVerifiers(oldVerifiers => [...oldVerifiers, {
      roleID: roleID,
      basicVerifiersLogic: basicVerifiersLogic,
      basicVerifiers: basicVerifiers
    }])
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-5 justify-between">
        <label className="block text-2xl font-bold font-flow">
          Role Verifiers
        </label>
        <button
          onClick={() => {
            generateScript(roleVerifiers)
          }}
        >
          Generate Script
        </button>
      </div>
      <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 auto-rows-fr">
        {
          roleVerifiers.map((roleVerifier, index) => {
            return (
              <RoleView 
                key={index}
                roleVerifier={roleVerifier}
              />
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

          New Role Verifier
        </button>
      </div>
      <RoleVerifierCreatorSlideOver
        open={open}
        setOpen={setOpen}
        createNewRoleVerifier={createNewRoleVerifier}
      />
    </div>
  )
}