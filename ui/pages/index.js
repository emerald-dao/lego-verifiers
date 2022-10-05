import MultiRolesVerifierCreator from "../components/MultiRolesVerifierCreator";

export default function Home(props) {
  const { user } = props
  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <MultiRolesVerifierCreator user={user} />
    </div>
  )
}