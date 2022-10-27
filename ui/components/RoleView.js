import { XCircleIcon } from "@heroicons/react/outline"
import Image from "next/image"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames } from "../lib/utils"

export default function RoleView(props) {
  const { index, roleVerifier, editRoleVerifier, deleteRoleVerifier } = props
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)

  return (
    <div className="relative">
      <div className="
    p-4 shrink-0 w-full h-full
    shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col relative
    "
        onClick={() => {
          if (transactionInProgress) {
            return
          }
          editRoleVerifier(roleVerifier)
        }}
      >
        <div className="flex justify-between truncate shrink">
          <div className="flex gap-x-1 items-center truncate shrink">
            <label className="truncate shrink text-gray-400 font-flow font-normal">Role&nbsp;
              <label className="truncate shrink text-indigo-500 text-lg font-bold leading-5">
                {roleVerifier.roleID}
              </label>
            </label>
          </div>
          <div className="w-6 h-6"></div>
        </div>

        <div className="truncate shrink mt-5 flex flex-col gap-y-3 text-sm">
          <div className="truncate shrink flex justify-between h-5 gap-x-2">
            <div className="truncate shrink flex gap-x-1 items-center">
              <div className={`shrink-0 rounded-full w-2 h-2 ${roleVerifier.basicVerifiersLogic == "AND" ? "bg-blue-500" : "bg-yellow-500"}`}></div>
              <label className="truncate shrink text-black font-flow font-bold">Verification Logic</label>
            </div>
            <label className={`text-center ${roleVerifier.basicVerifiersLogic == "AND" ? "text-blue-800 bg-blue-100" : "text-yellow-800 bg-yellow-100"} inline-flex rounded-full px-2 text-xs font-semibold leading-5`}>
              {roleVerifier.basicVerifiersLogic}
            </label>
          </div>

          <div className="truncate shrink flex justify-between h-5 gap-x-2">
            <div className="truncate shrink flex gap-x-1 items-center">
              <div className="shrink-0 rounded-full w-2 h-2 bg-green-500"></div>
              <label className="truncate shrink text-black font-flow font-bold">Basic Verifiers</label>
            </div>
            <div className="flex gap-x-1 items-center overflow-hidden">
              {
                roleVerifier.basicVerifiers.map((bv, index) => {
                  return (
                    <div key={index} className="rounded-full overflow-hidden flex items-center">
                      <Image className="rounded-full" src={bv.logo} width={20} height={20}></Image>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

      <button
        className="shrink-0 absolute right-4 top-4"
        disabled={transactionInProgress}
        onClick={() => {
          deleteRoleVerifier(index)
        }}
      >
        <XCircleIcon
          className={classNames(transactionInProgress ? "" : "hover:text-emerald-dark", "text-emerald")}
          width={24} height={24}
        />
      </button>
    </div>
  )
}