import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"

export default function DiscordRoleView() {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  return (
    <div className="flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Discord Role ID
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="roleID"
          id="roleID"
          disabled={transactionInProgress}
          required
          placeholder={`Discord RoleID`}
          className="bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2
          border border-emerald focus:border-emerald-dark
          outline-0 focus:outline-2 focus:outline-emerald-dark 
          placeholder:text-gray-300"
          onChange={(event) => {
            console.log("ROLEID")
          }}
        />
      </div>
    </div>
  )
}