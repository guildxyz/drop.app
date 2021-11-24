import { createHmac } from "crypto"

const hash = (data: string): string =>
  createHmac("sha256", process.env.SECRET).update(data).digest("base64")

export default hash
