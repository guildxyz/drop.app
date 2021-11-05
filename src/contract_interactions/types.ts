export type Drop = {
  serverId: string
  roleIds: string[]
  tokenAddress: string
  name: string
  id?: number
}

export type Role = {
  roleId: string
  tokenImageHash: string
  NFTName: string
  traitTypes: string[]
  values: string[]
}
