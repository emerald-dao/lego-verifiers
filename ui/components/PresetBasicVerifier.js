import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { classNames } from "../lib/utils";

export default function PresetBasicVerifier(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { index, updateVerifier, verifierInfo } = props

  return (
    <div className="flex flex-col gap-y-2 p-1 pb-4">
      {
        verifierInfo.parameters.length > 0 ?
          verifierInfo.parameters.map((parameter) => {
            return (
              <div className="flex flex-col gap-y-1" key={`${parameter.names.display}${index}`}>
                <label className="block text-base font-bold font-flow">
                  {parameter.names.display}
                </label>
                <div className="mt-1">
                  <input
                    type={`text`}
                    name={`${parameter.names.display}${index}`}
                    id={`${parameter.names.display}${index}`}
                    disabled={transactionInProgress}
                    required
                    placeholder={``}
                    className={classNames(
                      parameter.isValid ? `border-emerald` : `border-rose-500`,
                      `bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                               focus:border-emerald-dark
                              outline-0 focus:outline-2 focus:outline-emerald-dark 
                              placeholder:text-gray-300`
                    )}
                    value={parameter.value ?? ""}
                    onChange={(event) => {
                      if (parameter.regex) {
                        if (event.target.value === '' || parameter.regex.test(event.target.value)) {
                          updateVerifier(index, parameter.names.placeholder, event.target.value)
                        }
                        return
                      }
                      updateVerifier(index, parameter.names.placeholder, event.target.value)
                    }}
                    onBlur={(event) => {
                      const isValid = parameter.validate(parameter.value)
                      updateVerifier(index, parameter.names.placeholder, event.target.value, isValid)
                    }}
                  />
                </div>
              </div>
            )
          })
          : null
      }
    </div>
  )
}