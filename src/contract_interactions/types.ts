export type Drop = {
  urlName: string
  dropName: string
  serverId: string
  roleIds: string[]
  tokenAddress: string
  name: string
  contractId: number
  numOfActive: number
  id?: number
}

export type Role = {
  roleId: string
  tokenImageHash: string
  NFTName: string
  traitTypes: string[]
  values: string[]
}

export type RoleData = {
  imageHash: string
  tokenName: string
  traits: Array<[string, string]>
}
