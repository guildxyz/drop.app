export type Drop = {
  urlName: string
  dropName: string
  platform: "DISCORD" | "TELEGRAM"
  serverId: string
  contractId: number
  tokenAddress: string
  id?: number
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
