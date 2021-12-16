import { defaultAbiCoder } from "@ethersproject/abi"
import { arrayify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { Wallet } from "@ethersproject/wallet"
import { fetchRoles } from "components/start-airdrop/UploadNFTs/hooks/useRoles"
import { Chains } from "connectors"
import { AirdropAddresses } from "contracts"
import { fetchDiscordID } from "hooks/useDiscordId"
import type { NextApiRequest, NextApiResponse } from "next"
import checkParams from "utils/api/checkParams"
import fetchIsOwner from "utils/fetchIsOwner"

type Body = {
  chainId: number
  serverId: string
  address: string
  url: string
  platform: string
  roleIds: string[]
  metadata: string[]
}

const REQUIRED_BODY = [
  { key: "chainId", type: "number" },
  { key: "serverId", type: "string" },
  { key: "platform", type: "string" },
  { key: "roleIds", type: "string[]" },
  { key: "metadata", type: "string[]" },
  { key: "address", type: "string" },
  { key: "url", type: "string" },
]

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    const paramsCorrect = checkParams(req, res, REQUIRED_BODY)
    if (!paramsCorrect) return

    const { chainId, serverId, address, url, platform, roleIds, metadata }: Body =
      req.body

    if (!AirdropAddresses[Chains[chainId]]) {
      res.status(400).json({
        message: `No airdrop contract on network ${Chains[chainId]}.`,
      })
      return
    }

    if (platform !== "DISCORD") {
      res.status(400).json({
        message: "Only DISCORD is currently supported",
      })
      return
    }

    if (["start-airdrop", "dcauth"].includes(url)) {
      res.status(400).json({
        message: "Invalid urlName",
      })
      return
    }

    try {
      const discordId = await fetchDiscordID("", address).catch(() => {
        throw Error("Failed to fetch discord id of user")
      })
      const isOwner = await fetchIsOwner(serverId, discordId).catch(() => {
        throw Error("Failed to fetch owner of server")
      })
      if (!isOwner) {
        res.status(400).json({ message: "Not the owner of the server." })
        return
      }
      const roles = await fetchRoles("roles", serverId)
      const roleIdsOfServer = Object.keys(roles)
      if (roleIds.some((roleId) => !roleIdsOfServer.includes(roleId))) {
        res
          .status(400)
          .json({ message: "Some role ids are not valid for the server." })
        return
      }

      const payload = defaultAbiCoder.encode(
        ["address", "string", "string", "string", "string[]", "string[]", "address"],
        [
          AirdropAddresses[Chains[chainId]],
          platform,
          serverId,
          url,
          roleIds,
          metadata,
          address,
        ]
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
