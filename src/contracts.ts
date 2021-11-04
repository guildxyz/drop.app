import { Contract } from "@ethersproject/contracts"
import { InfuraProvider } from "@ethersproject/providers"
import { AirdropAddresses } from "hooks/airdrop/useAirdrop"
import AIRDROP_ABI from "static/abis/airdrop.json"

const airdropContracts = {
  GOERLI: new Contract(
    AirdropAddresses.GOERLI,
    AIRDROP_ABI,
    new InfuraProvider("goerli", process.env.INFURA_KEY)
  ),
}

export default airdropContracts
