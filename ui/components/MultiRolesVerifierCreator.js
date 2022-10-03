import Image from "next/image"
import React, { useState } from "react"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import ImageSelector from "./ImageSelector"
import MultiRolesView from "./MultiRolesView"

const NamePlaceholder = "Verifier's Name"
const DescriptionPlaceholder = "Details about this verifier"

const BasicInfoMemoizeImage = React.memo(({ image }) => {
  return (
    <div className="rounded-2xl shrink-0 h-[144px] aspect-square bg-white relative sm:max-w-[460px] ring-1 ring-black ring-opacity-10 overflow-hidden">
      <Image src={image} alt="" className="rounded-2xl" layout="fill" objectFit="cover" />
    </div>
  )
})
BasicInfoMemoizeImage.displayName = "BasicInfoMemozieImage"

export default function MultiRolesVerifierCreator(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imageSize, setImageSize] = useState(0)
  const [roleVerifiers, setRoleVerifiers] = useState([])

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-row justify-between gap-x-10">
        <div className="flex flex-col justify-between">
          <label className="block text-2xl font-bold font-flow">
            Image
          </label>
          <label className="block text-md font-flow leading-6 mt-2 mb-2">Should not be larger than 500 KB.</label>
          <ImageSelector imageSelectedCallback={(_image, _imageSize) => {
            setImage(_image)
            setImageSize(_imageSize)
          }} />
        </div>
        <BasicInfoMemoizeImage image={image || "/image.png"} />
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="block text-2xl font-bold font-flow">
          Name<span className="text-red-600">*</span>
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            disabled={transactionInProgress}
            required
            className="bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2
            border border-emerald focus:border-emerald-dark
            outline-0 focus:outline-2 focus:outline-emerald-dark 
            placeholder:text-gray-300"
            placeholder={NamePlaceholder}
            onChange={(event) => {
              setName(event.target.value)
            }}
          />
        </div>
      </div>

      {/** description */}
      <div className="flex flex-col gap-y-2">
        <label className="block text-2xl font-bold font-flow">
          Description
        </label>
        <div className="mt-1">
          <textarea
            rows={4}
            name="description"
            id="description"
            disabled={transactionInProgress}
            className="focus:ring-emerald-dark rounded-2xl px-3 py-2
                bg-emerald-ultralight resize-none block w-full font-flow text-lg placeholder:text-gray-300
                border border-emerald focus:border-emerald-dark
                outline-0 focus:outline-2 focus:outline-emerald-dark"

            defaultValue={''}
            spellCheck={false}
            placeholder={DescriptionPlaceholder}
            onChange={(event) => { setDescription(event.target.value) }}
          />
        </div>
      </div>

      <MultiRolesView 
        roleVerifiers={roleVerifiers} 
        setRoleVerifiers={setRoleVerifiers}
      />

    </div>
  )
}