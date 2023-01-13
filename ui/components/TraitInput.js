import { XIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'

export default function TraitInput(props) {
  const {index, trait, value, deleteTrait, updateTrait, deleteEnabled} = props

  const [traitName, setTraitName] = useState(trait)
  const [traitValue, setTraitValue] = useState(value)

  useEffect(() => {
    setTraitName(trait)
    setTraitValue(value)
  }, [index])

  return (
    <div className="flex flex-row gap-x-3 w-full items-center">
      <div className="flex flex-row gap-x-3 flex-grow">
        <input className="basis-1/2 border-emerald bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                               focus:border-emerald-dark
                              outline-0 focus:outline-2 focus:outline-emerald-dark 
                              placeholder:text-gray-300" 
        defaultValue={traitName}
        onChange={(event) => {
          updateTrait(index, event.target.value, value)
        }}
        />
        <input className="basis-1/2 border-emerald bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                               focus:border-emerald-dark
                              outline-0 focus:outline-2 focus:outline-emerald-dark 
                              placeholder:text-gray-300" 
        
        defaultValue={traitValue}
        onChange={(event) => {
          updateTrait(index, trait,event.target.value)
        }}
        />
      </div>
      <button
        type="button"
        className="bg-white rounded-md inline-flex text-gray-400 disabled:text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-dark"
        disabled={!deleteEnabled}
        onClick={() => {
          deleteTrait(index)
        }}
      >
        <XIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  )
}