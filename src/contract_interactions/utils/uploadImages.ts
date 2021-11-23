const uploadImages = async (
  images: Record<string, File>,
  platform: string,
  tokenAddress: string,
  chainId: number
): Promise<Record<string, string>> => {
  const formData = new FormData()
  Object.entries(images).forEach(([id, image]) =>
    formData.append(
      `${id}-${chainId}-${platform}-${tokenAddress}.png`,
      image,
      `${id}-${chainId}-${platform}-${tokenAddress}.${image.name.split(".").pop()}`
    )
  )
  const hashes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/uploadImages`, {
    method: "POST",
    body: formData,
  }).then((res) => (res.ok ? res.json() : Promise.reject()))

  return hashes
}

export default uploadImages
