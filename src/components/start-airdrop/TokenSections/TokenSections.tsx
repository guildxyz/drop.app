import Section from "components/common/Section"
import { useWatch } from "react-hook-form"
import RoleRewards from "./components/RoleRewards"
import TokenData from "./components/TokenData"

const TokenSections = () => {
  const platform = useWatch({ name: "platform" })

  return (
    <>
      <Section title="Set token name, symbol and initial balance">
        <TokenData />
      </Section>

      <Section title="Set rewards for the selected roles">
        <RoleRewards />
      </Section>
    </>
  )
}

export default TokenSections
