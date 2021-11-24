export type Drop = {
  urlName: string
  dropName: string
  platform: "DISCORD" | "TELEGRAM"
  serverId: string
  roleIds: string[]
  tokenAddress: string
  name: string
  contractId: number
  numOfActive: number
  id?: number
}

export type Data = {
  tokenImageHash: string
  NFTName: string
  traitTypes: string[]
  values: string[]
}

export type RoleData = {
  imageHash: string
  tokenName: string
  traits: string[]
  values: string[]
}
