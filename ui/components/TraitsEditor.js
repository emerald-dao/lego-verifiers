import { useEffect, useState } from "react";
import TraitInput from "./TraitInput";
import { useRecoilState } from "recoil"
import {
  showBasicNotificationState,
  basicNotificationContentState,
} from "../lib/atoms"

export default function TraitsEditor(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)

  const [deleteEnabled, setDeleteEnabled] = useState(false)

  const { traits, setTraits, traitID, setTraitID } = props

  const updateTrait = (index, traitName, value) => {
    setTraits(oldTraits => {
      const newTraits = oldTraits.map((trait, idx) => {
        if (idx == index) {
          return {...trait, trait: traitName, value: value}
        }
        return trait
      })
      return newTraits
    })
  }

  const deleteTrait = (index) => {
    if (traits.length == 1) {
      return
    }
    const newTraits = traits.filter((trait, idx) => {
      return idx != index
    })
    setTraits(newTraits)
  }

  useEffect(() => {
    if (traits.length == 1) {
      setDeleteEnabled(false)
    } else {
      setDeleteEnabled(true)
    }
  }, [traits])

  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="flex flex-row gap-x-3 w-full items-center">
      <div className="flex flex-row gap-x-3 flex-grow">
        <label className="basis-1/2 font-semibold text-lg">Trait</label> 
        <label className="basis-1/2 font-semibold text-lg">Value</label> 
        </div>
        <div className="h-6 w-6" aria-hidden="true" />

      </div>
      {
        traits.map((t, index) => {
          return (
            <TraitInput key={t.id} id={index} index={index} trait={t.trait} value={t.value} deleteTrait={deleteTrait} updateTrait={updateTrait} deleteEnabled={deleteEnabled} />
          )
        })
      }
      <button
        className="mt-4 h-12 w-36 items-center inline-flex justify-center rounded-xl border border-transparent bg-emerald py-2 px-4 text-sm font-bold text-black shadow-sm hover:bg-emerald-dark focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
        onClick={() => {
          if (traits.length >= 5) {
            setShowBasicNotification(true)
            setBasicNotificationContent({ type: "exclamation", title: "No more than 5 items", detail: null })
            return
          }
          setTraits([
            ...traits,
            { id: traitID + 1, trait: "", value: "" }
          ])
          setTraitID(traitID + 1)
        }}
      >
        Add Trait
      </button>
    </div>
  )
}