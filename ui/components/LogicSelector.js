import { useState } from "react"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames } from "../lib/utils"

export const BasicVerifiersLogic = {
  AND: "AND",
  OR: "OR"
}

export default function LogicSelector() {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const [logicAnd, setLogicAnd] = useState(true)
  const [logicOr, setLogicOr] = useState(false)

  return (
    <div className="flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Basic Verifiers Logic
      </label>
      <div className="mt-1 flex gap-x-4 h-12">
        <button
          className={classNames(
            logicAnd ? "bg-emerald text-black shadow-md" : "bg-emerald-light text-gray-500",
            `basis-1/2 rounded-2xl font-flow font-semibold`
          )
          }
          onClick={() => {
            if (!logicAnd) {
              setLogicAnd(true)
              setLogicOr(false)
            }
          }}
        >
          AND
        </button>
        <button
          className={classNames(
            logicOr ? "bg-emerald text-black shadow-md" : "bg-emerald-light text-gray-500",
            `basis-1/2 rounded-2xl font-flow font-semibold`
          )
          }
          onClick={() => {
            if (!logicOr) {
              setLogicOr(true)
              setLogicAnd(false)
            }
          }}
        >
          OR
        </button>
      </div>
    </div>
  )
}