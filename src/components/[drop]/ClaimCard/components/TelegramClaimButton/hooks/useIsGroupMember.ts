import useSWR from "swr"

const fetchIsGroupMember = (
  _: string,
  groupId: string,
  userId: string
): Promise<boolean> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/member/${groupId}/${userId}`
  )
    .then((response) =>
      response.json().then((body) => (response.ok ? body : Promise.reject(body)))
    )
    .catch((error) => Promise.reject({ message: error.message ?? "Unknown error" }))

const useIsGroupMember = (groupId: string, userId: string) => {
  const shouldFetch = groupId?.length > 0 && userId?.length > 0
  const { data } = useSWR(
    shouldFetch ? ["isGroupMember", groupId, userId] : null,
    fetchIsGroupMember
  )

  return data
}

export { fetchIsGroupMember }
export default useIsGroupMember
