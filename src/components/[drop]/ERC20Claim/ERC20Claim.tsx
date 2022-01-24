import { useDrop } from "../DropProvider"
import DiscordSections from "./components/DiscordSections"
import TelegramSections from "./components/TelegramSections"

const ERC20Claim = () => {
  const { platform } = useDrop()

  if (platform === "DISCORD") return <DiscordSections />
  return <TelegramSections />
}

export default ERC20Claim
