import { defaultAbiCoder } from "@ethersproject/abi"
import { arrayify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { Wallet } from "@ethersproject/wallet"
import { fetchRoles } from "components/start-airdrop/NFTSections/components/Uploaders/hooks/useRoles"
import { Chains } from "connectors"
import { AirdropAddresses } from "contracts"
import { Platform } from "contract_interactions/types"
import { fetchUserId } from "hooks/useUserId"
import type { NextApiRequest, NextApiResponse } from "next"
import checkParams from "utils/api/checkParams"
import fetchIsOwner from "utils/fetchIsOwner"

type Body = {
  chainId: number
  serverId: string
  address: string
  urlName: string
  platform: Platform
  roleId: string
}

const REQUIRED_BODY = [
  { key: "chainId", type: "number" },
  { key: "serverId", type: "string" },
  { key: "platform", type: "string" },
  { key: "roleId", type: "string" },
  { key: "address", type: "string" },
  { key: "urlName", type: "string" },
]

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    const paramsCorrect = checkParams(req, res, REQUIRED_BODY)
    if (!paramsCorrect) return

    const { chainId, serverId, address, urlName, platform, roleId }: Body = req.body

    if (!AirdropAddresses.ERC20[Chains[chainId]]) {
      res.status(400).json({
        message: `No airdrop contract on network ${Chains[chainId]}.`,
      })
      return
    }

    try {
      const userId = await fetchUserId("", address, platform).catch(() => {
        throw Error("Failed to fetch discord id of user")
      })
      if (platform === "DISCORD") {
        const isOwner = await fetchIsOwner(serverId, userId).catch(() => {
          throw Error("Failed to fetch owner of server")
        })
        if (!isOwner) {
          res.status(400).json({ message: "Not the owner of the server." })
          return
        }
        const roles = await fetchRoles("roles", serverId)
        const roleIdsOfServer = Object.keys(roles)
        if (!roleIdsOfServer.includes(roleId)) {
          res.status(400).json({ message: "Role id is not valid for the server." })
          return
        }
      } else if (platform === "TELEGRAM") {
        res.status(400).json({ message: "Roles can't be added to a Telegram drop" })
        return
      }

      const payload = defaultAbiCoder.encode(
        ["address", "string", "string", "address"],
        [AirdropAddresses.ERC20[Chains[chainId]], urlName, roleId, address]
      )
      const message = keccak256(payload)
      const wallet = new Wallet(process.env.SIGNER_PRIVATE_KEY)
      const signature = await wallet.signMessage(arrayify(message)).catch(() => {
        throw Error("Failed to sign data")
      })
      res.status(200).json({ signature })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } else
    res
      .status(501)
      .send(`Method ${req.method} is not implemented for this endpoint.`)
}

export default handler
