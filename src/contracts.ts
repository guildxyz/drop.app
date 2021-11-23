import { Contract } from "@ethersproject/contracts"
import { InfuraProvider, JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
import AIRDROP_ABI from "static/abis/airdrop.json"
import DROPCENTER_ABI from "static/abis/dropcenter.json"
import ROLE_TOKEN_ABI from "static/abis/roletoken.json"

const multicallConfigs = {
  GOERLI: {
    multicallAddress: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
    rpcUrl: RPC.GOERLI.rpcUrls[0],
  },
  POLYGON: {
    multicallAddress: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
    rpcUrl: RPC.POLYGON.rpcUrls[0],
  },
}

enum AirdropAddresses {
  GOERLI = "0x9c0751108eADa6D81A60e619101199B7465f45A9",
  POLYGON = "",
}

enum DropCenterAddresses {
  GOERLI = "0xA25e73F5aa65C116A166D28690d6a561f18EA0FD",
  POLYGON = "",
}

const defaultProviders = {
  GOERLI: new InfuraProvider("goerli"),
  POLYGON: new JsonRpcProvider(RPC.POLYGON.rpcUrls[0]),
}

const getDropCenterContract = (chainId: number, provider: Provider): Contract =>
  new Contract(
    DropCenterAddresses[Chains[chainId]],
    DROPCENTER_ABI,
    provider ?? defaultProviders[Chains[chainId]]
  )

const getAirdropContract = (chainId: number, provider: Provider): Contract =>
  new Contract(
    AirdropAddresses[Chains[chainId]],
    AIRDROP_ABI,
    provider ?? defaultProviders[Chains[chainId]]
  )

const getTokenContract = (
  chainId: number,
  tokenAddress: string,
  provider?: Provider
): Contract =>
  new Contract(
    tokenAddress,
    ROLE_TOKEN_ABI,
    provider ?? defaultProviders[Chains[chainId]]
  )

export {
  AirdropAddresses,
  multicallConfigs,
  getTokenContract,
  getAirdropContract,
  getDropCenterContract,
}
