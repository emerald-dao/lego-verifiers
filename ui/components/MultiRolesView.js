import { useState } from "react";
import { generateScript } from "../lib/utils";
import RoleVerifierCreatorSlideOver from "./RoleVerifierCreatorSlideOver";
import RoleView from "./RoleView";

import { useRecoilState } from "recoil"
import {
  showBasicNotificationState,
  basicNotificationContentState
} from "../lib/atoms.js"
import { PlusIcon } from "@heroicons/react/outline";

export default function MultiRolesView(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)

  const {roleVerifiers, setRoleVerifiers} = props
  const [open, setOpen] = useState(false)
  const [verifierToBeEdit, setVerifierToBeEdit] = useState(null)

  const createNewRoleVerifier = (roleID, basicVerifiersLogic, basicVerifiers) => {
    setRoleVerifiers(oldVerifiers => [...oldVerifiers, {
      roleID: roleID,
      basicVerifiersLogic: basicVerifiersLogic,
      basicVerifiers: basicVerifiers
    }])
  }

  const deleteRoleVerifier = (index) => {
    const newVerifiers = roleVerifiers.filter((verifier, idx) => idx != index)
    setRoleVerifiers(newVerifiers)
  }

  const editRoleVerifier = (verifier) => {
    if (verifier) {
      setVerifierToBeEdit(verifier)
      setOpen(true)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-5 justify-between">
        <label className="block text-2xl font-bold font-flow">
          Role Verifiers<span className="text-red-600">*</span>
        </label>
      </div>
      <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 auto-rows-fr">
        {
          roleVerifiers.map((roleVerifier, index) => {
            return (
              <RoleView 
                key={index}
                index={index}
                roleVerifier={roleVerifier}
                editRoleVerifier={editRoleVerifier}
                deleteRoleVerifier={deleteRoleVerifier}
              />
            )
          })
        }
        <button className="
            group
            h-[128px] p-4 shrink-0
            rounded-2xl 
            flex flex-col gap-y-4 
            border-4 border-emerald hover:border-emerald-dark border-dashed
            items-center justify-center
            "
          onClick={() => {
            setVerifierToBeEdit(null)
            setOpen(!open)
          }}
          >
            <PlusIcon className="text-emerald group-hover:text-emerald-dark" width={64} height={64} />
        </button>
      </div>
      <RoleVerifierCreatorSlideOver
        open={open}
        setOpen={setOpen}
        roleVerifierToBeEdit={verifierToBeEdit}
        createNewRoleVerifier={createNewRoleVerifier}
      />
    </div>
  )
}