import { RadioGroup } from '@headlessui/react'
import { useRecoilState } from "recoil"
import {
  transactionInProgressState
} from "../lib/atoms"

export const ModeNormal = {
  key: "Normal",
  name: 'Normal',
  raw: 0,
  intro: 'User will get all the eligible roles',
  tagColor: "text-green-800 bg-green-100"
}

export const ModeShortCircuit = {
  key: "ShortCircuit",
  name: 'Short Circuit',
  raw: 1,
  intro: 'User will get the first eligible role',
  tagColor: "text-blue-800 bg-blue-100"
}

export const getModeFromRaw = (raw) => {
  if (raw == 0) {
    return ModeNormal
  }

  if (raw == 1) {
    return ModeShortCircuit
  }
}

const modes = [ModeNormal, ModeShortCircuit]

export default function VerificationModeSelector(props) {
  const { mode, setMode } = props
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)

  return (
    <div className="mx-auto w-full">
      <RadioGroup disabled={transactionInProgress} value={mode} onChange={setMode}>
        <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4 auto-rows-fr">
          {modes.map((mode) => (
            <RadioGroup.Option
              key={mode.key}
              value={mode}
              className={({ active, checked }) =>
                `${active
                  ? 'ring-2 ring-emerald ring-offset-2'
                  : 'ring-1 ring-black ring-opacity-5'
                }
                  ${checked ? 'bg-emerald text-black' : 'bg-white'
                }

                  relative flex cursor-pointer rounded-2xl px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-semibold font-flow text-lg`}
                        >
                          {mode.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={`inline text-gray-500`}
                        >
                          {mode.intro}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <CheckIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.4" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}