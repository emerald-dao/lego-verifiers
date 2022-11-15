import { useState, useEffect } from "react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Combobox } from "@headlessui/react"

import { classNames } from "../lib/utils"

export default function EnumSelector(props) {
  const [query, setQuery] = useState("")
  const { parameter } = props
  const [filteredOptions, setFilteredTypes] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const options = parameter.type.options
  console.log("parameter", parameter)

  useEffect(() => {
    if (selectedOption && parameter.value != selectedOption) {
      parameter.value = selectedOption
    }
  }, [selectedOption])

  useEffect(() => {
    setFilteredTypes(
      query === ""
        ? options
        : options.filter((option) => {
          const content = `${option}`
          return content.toLowerCase().includes(query.toLowerCase())
        }))
  }, [query, options])

  return (
    <Combobox as="div" className={props.className} value={selectedOption} onChange={async (option) => {
      if (!selectedOption || option != selectedOption) {
        setSelectedOption(option)
      }
    }}>

      <div className="relative mt-1">
        <Combobox.Input
          className={
            classNames(
              selectedOption ? `border-emerald` : `border-rose-500`,
              "w-full h-[50px] text-lg font-flow rounded-2xl border bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
            )
          }
          onChange={(event) => {
            setQuery(event.target.value)
          }}
          displayValue={(option) => option}
          onBlur={(event) => {
            if (!selectedOption) {
              setQuery("")
            }
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-emerald-light" : "text-black"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <span className={classNames("ml-3 truncate", selected && "font-semibold")}>{`${option}`}</span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-black" : "text-emerald-dark"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
