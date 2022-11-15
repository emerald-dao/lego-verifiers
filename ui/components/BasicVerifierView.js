import { XCircleIcon } from "@heroicons/react/outline";
import BasicVerifierCreator from "./BasicVerifierCreator";
import PresetBasicVerifier from "./PresetBasicVerifier";

export default function BasicVerifierView(props) {
  const { isPreset, verifierInfo, index, updateNFTCatalogVerifier, updateVerifierParam, deleteVerifier } = props

  return (
    <div className="
    h-[424px] p-4 shrink-0
    shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-2 
    ">
      <div className="flex justify-end">
        <button
          onClick={() => {
            deleteVerifier(index)
          }}
        >
          <XCircleIcon
            className="text-emerald hover:text-emerald-dark"
            width={32} height={32}
          />
        </button>
      </div>

      {
        isPreset ?
          <PresetBasicVerifier index={index} updateVerifierParam={updateVerifierParam} verifierInfo={verifierInfo} />
          : <BasicVerifierCreator index={index} updateVerifierParam={updateVerifierParam} verifierInfo={verifierInfo} updateNFTCatalogVerifier={updateNFTCatalogVerifier} />
      }
    </div>
  )
}