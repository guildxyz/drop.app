const isGroupMember = (groupId: string, userId: string): Promise<boolean> =>
  fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/telegram/member/${groupId}/${userId}`
  )
    .then((response) =>
      response.json().then((body) => (response.ok ? body : Promise.reject(body)))
    )
    .catch((error) => Promise.reject({ message: error.message ?? "Unknown error" }))

export default isGroupMember
