import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames, isValidRoleID } from "../lib/utils"

export default function DiscordRoleView(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { roleID, setRoleID } = props
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const valid = isValidRoleID(roleID)
    setIsValid(valid)
  })

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
          value={roleID ?? ""}
          className={classNames(
            isValid ? `border-emerald` : `border-rose-500`,
            `bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
             focus:border-emerald-dark
            outline-0 focus:outline-2 focus:outline-emerald-dark 
            placeholder:text-gray-300`
          )}
          onChange={(event) => {
            const reg = /^(0|[1-9]\d*)$/
            if (event.target.value === "" || reg.test(event.target.value)) {
              setRoleID(event.target.value)
            }
          }}
          onBlur={() => {
            const valid = isValidRoleID(roleID)
            setIsValid(valid)
          }}
        />
      </div>
    </div>
  )
}