import { numOfDrops } from "./airdrop"

const getDropIds = (chainId: number): Promise<number[]> =>
  numOfDrops(chainId).then((dropsCount) => [...Array(dropsCount)].map((_, i) => i))

export default getDropIds
