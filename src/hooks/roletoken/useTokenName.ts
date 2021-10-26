import useSWR from "swr"
import useRoleToken from "./useRoleToken"

const useTokenName = (address: string): string => {
  const { getName } = useRoleToken(address)

  const shouldFetch = address?.length > 0

  const { data } = useSWR(shouldFetch ? ["tokenName", address, getName] : null, () =>
    getName()
  )

  return data
}
export default useTokenName
