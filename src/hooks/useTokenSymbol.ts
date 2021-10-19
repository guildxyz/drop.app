import useSWR from "swr"
import useRoleToken from "./useRoleToken"

const useTokenSymbol = (address: string): string => {
  const { getSymbol } = useRoleToken(address)

  const shouldFetch = address?.length > 0

  const { data } = useSWR(
    shouldFetch ? ["tokenSymbol", address, getSymbol] : null,
    () => getSymbol()
  )

  return data
}
export default useTokenSymbol
