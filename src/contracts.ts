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
  GOERLI = "0x254EF5F30A7260dC9132CFbD4cF9663Ef106b10A",
  POLYGON = "0x2223C242858d63E471ac1169254040BE90766AC0",
}

enum DropCenterAddresses {
  GOERLI = "",
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
