const hashId = (userId: string): Promise<string> =>
  fetch("/api/hash-user-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.hashed
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default hashId
