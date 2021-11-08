import { Contract } from "@ethersproject/contracts"
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers"
import { RPC } from "connectors"
import AIRDROP_ABI from "static/abis/airdrop.json"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"

enum AirdropAddresses {
  GOERLI = "0xb503D6f75F0c9A6110B22E434849257127266e44",
  POLYGON = "0x18Bb4142B25d39d07b0dd1aAF317D6A963AFdAA8",
}

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

const tokenContractGetters = {
  GOERLI: (tokenAddress: string): Contract =>
    new Contract(
      tokenAddress,
      ROLE_TOKEN_ABI,
      new InfuraProvider("goerli", process.env.INFURA_KEY)
    ),
}

export { AirdropAddresses, tokenContractGetters }
export default airdropContracts
