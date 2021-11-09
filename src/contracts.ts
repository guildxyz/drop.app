import { Contract } from "@ethersproject/contracts"
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers"
import { RPC, supportedChains } from "connectors"
import AIRDROP_ABI from "static/abis/airdrop.json"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"

enum AirdropAddresses {
  GOERLI = "0x254EF5F30A7260dC9132CFbD4cF9663Ef106b10A",
  POLYGON = "0x18Bb4142B25d39d07b0dd1aAF317D6A963AFdAA8",
}

const providers = {
  GOERLI: new InfuraProvider("goerli", process.env.INFURA_KEY),
  POLYGON: new JsonRpcProvider(RPC.POLYGON.rpcUrls[0]),
}

// const providers = Object.fromEntries(
//   supportedChains.map((chain) => [chain, new JsonRpcProvider(RPC[chain].rpcUrls[0])])
// )

const airdropContracts = Object.fromEntries(
  supportedChains.map((chain) => [
    chain,
    new Contract(AirdropAddresses[chain], AIRDROP_ABI, providers[chain]),
  ])
)

const tokenContractGetters = Object.fromEntries(
  supportedChains.map((chain) => [
    chain,
    (tokenAddress: string): Contract =>
      new Contract(tokenAddress, ROLE_TOKEN_ABI, providers[chain]),
  ])
)

export { AirdropAddresses, tokenContractGetters }
export default airdropContracts
