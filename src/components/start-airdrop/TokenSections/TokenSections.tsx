import Section from "components/common/Section"
import { useWatch } from "react-hook-form"
import GroupReward from "./components/GroupReward"
import RoleRewards from "./components/RoleRewards"
import TokenInitialBalance from "./components/TokenInitialBalance"
import TokenNameAndSymbol from "./components/TokenNameAndSymbol"

const TokenSections = () => {
  const platform = useWatch({ name: "platform" })

  return (
    <>
      <Section title="Token name and symbol">
        <TokenNameAndSymbol />
      </Section>

      <Section title="Initial balance">
        <TokenInitialBalance />
      </Section>

      {platform === "DISCORD" ? (
        <Section title="Rewards for the selected roles">
          <RoleRewards />
        </Section>
      ) : (
        <Section title="Reward for group members">
          <GroupReward />
        </Section>
      )}
    </>
  )
}

export default TokenSections
