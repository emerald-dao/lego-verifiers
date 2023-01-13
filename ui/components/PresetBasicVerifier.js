import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames } from "../lib/utils";
import EnumSelector from "./EnumSelector";

export default function PresetBasicVerifier(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { index, updateVerifierParam, verifierInfo } = props

  const generateInputByParameter = (parameter) => {
    if (parameter.type.name == "PositiveInt") {
      return (
        <div>
          <input
            type={`text`}
            name={`${parameter.names.display}${index}`}
            id={`${parameter.names.display}${index}`}
            disabled={transactionInProgress}
            required
            placeholder={``}
            className={classNames(
              parameter.type.validate(parameter.value) ? `border-emerald` : `border-rose-500`,
              `bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                 focus:border-emerald-dark
                outline-0 focus:outline-2 focus:outline-emerald-dark 
                placeholder:text-gray-300`
            )}
            value={parameter.value ?? ""}
            onChange={(event) => {
              if (parameter.type.formatRegex) {
                if (event.target.value === '' || parameter.type.formatRegex.test(event.target.value)) {
                  updateVerifierParam(index, parameter.names.placeholder, event.target.value)
                }
                return
              }
              updateVerifierParam(index, parameter.names.placeholder, event.target.value)
            }}
            onBlur={(event) => {
              const isValid = parameter.type.validate(parameter.value)
              updateVerifierParam(index, parameter.names.placeholder, event.target.value, isValid)
            }}
          />
        </div>)
    }

    if (parameter.type.name == "Enum") {
      return (
        <EnumSelector parameter={parameter} />
      )
    }
  }

  return (
    <div className={`flex flex-col h-full justify-between font-flow p-1`}>
      <div className="flex flex-col gap-y-1 font-flow">
        <div className="flex items-center rounded-full py-1 text-base font-bold text-black w-16 h-16 relative">
          <Image className="rounded-full object-contain" src={verifierInfo.logo} alt="" fill sizes="33vw" />
        </div>
        <label className="cursor-pointer truncate text-left text-xl font-bold">{verifierInfo.name}</label>
        <label className="cursor-pointer text-left text-sm">{verifierInfo.description}</label>
      </div>
      <div className="flex flex-col gap-y-2 p-1 pb-2">
        {
          verifierInfo.parameters.length > 0 ?
            verifierInfo.parameters.map((parameter) => {
              return (
                <div className="flex flex-col" key={`${parameter.names.display}${index}`}>
                  <label className="block text-base font-bold font-flow">
                    {parameter.names.display}
                  </label>
                  {generateInputByParameter(parameter)}
                </div>
              )
            })
            : null
        }
        {/* <div className="flex flex-col h-8 w-full items-center justify-center">
          <div className="flex gap-x-1 w-full justify-between items-center text-emerald">
            <div>Traits Filter</div>
            <PlusIcon className="h-5 w-5"/>
          </div> 
        </div> */}
      </div>
    </div>
  )
}