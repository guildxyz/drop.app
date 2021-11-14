import { Provider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { getDataOfDrop } from "contract_interactions/airdrop"
import { Drop } from "contract_interactions/types"
import useSWR from "swr"

const getDrop = async (
  _: string,
  chainId: number,
  urlName: string,
  provider: Provider
): Promise<Drop> => getDataOfDrop(chainId, urlName, provider)

const useDrop = (urlName: string, fallbackData?: Drop): Drop => {
  const { chainId, library } = useWeb3React<Web3Provider>()

  const { data } = useSWR(["drops", chainId, urlName, library], getDrop, {
    fallbackData,
    revalidateOnMount: true,
  })

  return data
}

export default useDrop
