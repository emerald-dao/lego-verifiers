import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames } from "../lib/utils"

export const BasicVerifiersLogic = {
  AND: "AND",
  OR: "OR"
}

export const TraitsLogic = {
  AND: "AND",
  OR: "OR"
}

export default function LogicSelector(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { basicVerifiersLogic, setBasicVerifiersLogic, title } = props

  return (
    <div className="flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        {title}
      </label>
      <div className="mt-1 flex gap-x-4 h-12">
        <button
          className={classNames(
            basicVerifiersLogic == BasicVerifiersLogic.AND ? "bg-emerald text-black shadow-md" : "bg-emerald-light text-gray-500",
            `basis-1/2 rounded-2xl font-flow font-semibold`
          )
          }
          onClick={() => {
            if (basicVerifiersLogic == BasicVerifiersLogic.OR) {
              setBasicVerifiersLogic(BasicVerifiersLogic.AND)
            }
          }}
        >
          AND
        </button>
        <button
          className={classNames(
            basicVerifiersLogic == BasicVerifiersLogic.OR ? "bg-emerald text-black shadow-md" : "bg-emerald-light text-gray-500",
            `basis-1/2 rounded-2xl font-flow font-semibold`
          )
          }
          onClick={() => {
            if (basicVerifiersLogic == BasicVerifiersLogic.AND) {
              setBasicVerifiersLogic(BasicVerifiersLogic.OR)
            }
          }}
        >
          OR
        </button>
      </div>
    </div>
  )
}