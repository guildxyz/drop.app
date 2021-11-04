import { Contract } from "@ethersproject/contracts"
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers"
import { RPC } from "connectors"
import { AirdropAddresses } from "hooks/airdrop/useAirdrop"
import AIRDROP_ABI from "static/abis/airdrop.json"

const airdropContracts = {
  GOERLI: new Contract(
    AirdropAddresses.GOERLI,
    AIRDROP_ABI,
    new InfuraProvider("goerli", process.env.INFURA_KEY)
  ),
  POLYGON: new Contract(
    AirdropAddresses.POLYGON,
    AIRDROP_ABI,
    new JsonRpcProvider(RPC.POLYGON.rpcUrls[0])
  ),
}

export default airdropContracts
