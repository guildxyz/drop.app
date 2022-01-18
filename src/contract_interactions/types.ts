export type Drop = {
  urlName: string
  dropName: string
  platform: Platform
  serverId: string
  contractId: number
  tokenAddress: string
  communityName: string
  communityImage: string
  hasAccess: boolean
  dropContractAddress: string
  dropContractType: string
  ownerAddress?: string
}

export type Attribute = {
  trait_type: string
  value: string
}

export type RoleData = {
  name: string
  description: string
  image: string
  external_url: string
  attributes: Attribute[]
}

export type Platform = "DISCORD" | "TELEGRAM"
