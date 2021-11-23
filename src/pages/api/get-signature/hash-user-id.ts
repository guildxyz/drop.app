import isAuthenticated from "contract_interactions/utils/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"
import checkParams from "utils/api/checkParams"
import hash from "utils/api/hash"

type Body = {
  userId: string
  address: string
}

const REQUIRED_BODY = [
  { key: "userId", type: "string" },
  { key: "address", type: "string" },
]

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    try {
      const paramsCorrect = checkParams(req, res, REQUIRED_BODY)
      if (!paramsCorrect) return

      const { userId, address }: Body = req.body

      const authenticated = await isAuthenticated(userId, address)
      if (!authenticated) {
        res.status(400).json({ errors: [{ message: "Not authenticated" }] })
        return
      }

      const hashed = hash(userId)
      res.status(200).json({ hashed })
    } catch (error) {
      res
        .status(500)
        .json({ errors: [{ message: `Unknown error: ${error.message}` }] })
    }
  } else
    res
      .status(501)
      .send(`Method ${req.method} is not implemented for this endpoint.`)
}

export default handler
