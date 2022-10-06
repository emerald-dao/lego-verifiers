import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"
import useSWR from "swr"
import VerifiersList from "../components/VerifiersList"
import { getVerifiers } from "../flow/scripts"

const convertVerifiers = (verifierMaps) => {
  const verifierIDs = Object.keys(verifierMaps)
  let verifiers = []
  for (let i = 0; i < verifierIDs.length; i++) {
    const verifierID = verifierIDs[i]
    const verifier = verifierMaps[verifierID]
    verifiers.push(verifier)
  }

  return verifiers.sort((a, b) => b.uuid - a.uuid)
}

const verifiersFetcher = async (funcName, address) => {
  return await getVerifiers(address)
}

export default function Profile(props) {
  const account = props.user && props.user.addr
  console.log(account)
  const { data: verifiersData, error: verifiersError } = useSWR(
    account ? ["verifiersFetcher", account] : null, verifiersFetcher)

  console.log(verifiersData)
  console.log(verifiersError)

  const [verifiers, setVerifiers] = useState([])

  const showList = () => {
    console.log("verifiers", verifiers)
    if (!verifiersData) {
      return (
        <div className="flex mt-10 h-[200px] justify-center">
          <SpinnerCircular size={50} thickness={180} speed={100} color="#38E8C6" secondaryColor="#e2e8f0" />
        </div>
      )
    } else {
      return (
        <div className="mt-10 flex flex-col gap-y-10">
          <VerifiersList verifiers={verifiers} user={props.user} /> 
        </div>
      )
    }
  }

  useEffect(() => {
    if (verifiersData) {
      setVerifiers(convertVerifiers(verifiersData))
    }
  }, [verifiersData])

  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <div className="w-full flex justify-center"></div>
      {showList()}
    </div>
  )
}