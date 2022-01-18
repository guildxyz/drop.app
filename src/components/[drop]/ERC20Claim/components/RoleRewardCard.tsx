import { Text } from "@chakra-ui/react"
import { formatEther } from "@ethersproject/units"
import Card from "components/common/Card"
import useRoleName from "components/[drop]/ClaimCard/hooks/useRoleName"

type Props = {
  roleId: string
  reward: string
}

const RoleRewardCard = ({ roleId, reward }: Props) => {
  const roleName = useRoleName(roleId)

  return (
    <Card p={5}>
      <Text>
        {roleName ?? "Loading..."} - {+formatEther(reward)}
      </Text>
    </Card>
  )
}

export default RoleRewardCard
