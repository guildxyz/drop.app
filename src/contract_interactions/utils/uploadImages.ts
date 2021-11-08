const uploadImages = async (
  images: Record<string, File>,
  serverId: string,
  tokenAddress: string
): Promise<Record<string, string>> => {
  const formData = new FormData()
  Object.entries(images).forEach(([id, image]) =>
    formData.append(
      `${serverId}-${id}-${tokenAddress}.png`,
      image,
      `${serverId}-${id}-${tokenAddress}.${image.name.split(".").pop()}`
    )
  )
  const hashes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/uploadImages`, {
    method: "POST",
    body: formData,
  }).then((res) => (res.ok ? res.json() : Promise.reject()))

  return hashes
}

export default uploadImages
