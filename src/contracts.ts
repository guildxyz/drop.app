import { Contract } from "@ethersproject/contracts"
import { InfuraProvider, JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
import AIRDROP_ABI from "static/abis/airdrop.json"
import DROPCENTER_ABI from "static/abis/dropcenter.json"
import ERC20_AIRDROP_ABI from "static/abis/erc20drop.json"
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
  GOERLI = "0x907EdE6fBa76fCdf2CD44dd26807837965ab47e0",
  POLYGON = "0xb68b287E6341F39053348Bfa81C800eaE6257C33",
}

enum DropCenterAddresses {
  GOERLI = "0x168a261420baF5A33db4464a7Ca94D257FCA2305",
  POLYGON = "0x9941Dedc9714fffDD90A3b1A7bDa30BE2b523882",
}

enum ERC20AirdropAddresses {
  GOERLI = "0x7FF92e7e78395ED4f164fD016998f0058487B3d6",
  POLYGON = "",
}

const defaultProviders = {
  ...(process.env.INFURA_ID?.length > 0
    ? { GOERLI: new InfuraProvider("goerli", process.env.INFURA_ID) }
    : {}),
  ...(process.env.ALCHEMY_ID?.length > 0
    ? {
        POLYGON: new JsonRpcProvider(
          `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
        ),
      }
    : {}),
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

const getERC20AirdropContract = (chainId: number, provider: Provider): Contract =>
  new Contract(
    ERC20AirdropAddresses[Chains[chainId]],
    ERC20_AIRDROP_ABI,
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
  getERC20AirdropContract,
}
