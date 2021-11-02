import { defaultAbiCoder } from "@ethersproject/abi"
import { arrayify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { Wallet } from "@ethersproject/wallet"
import { Chains } from "connectors"
import { AirdropAddresses } from "hooks/airdrop/useAirdrop"
import { fetchDiscordID } from "hooks/discord/useDiscordId"
import { fetchOwnerId } from "hooks/discord/useOwnerId"
import { fetchRoles } from "hooks/discord/useRoles"
import type { NextApiRequest, NextApiResponse } from "next"

type Body = {
  chainId: number
  serverId: string
  address: string
  roleId: string
  tokenAddress: string
  recieverAddress: string
}

const REQUIRED_BODY = [
  { key: "chainId", type: "number" },
  { key: "serverId", type: "string" },
  { key: "address", type: "string" },
  { key: "roleId", type: "string" },
  { key: "tokenAddress", type: "string" },
  { key: "recieverAddress", type: "string" },
]

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    const missingKeys = REQUIRED_BODY.filter(({ key }) => !(key in req.body))
    if (missingKeys.length > 0) {
      res.status(400).json({
        errors: missingKeys.map(({ key }) => ({
          key,
          message: `Key "${key}" missing.`,
        })),
      })
      return
    }

    const wrongType = REQUIRED_BODY.filter(
      ({ key, type }) => typeof req.body[key] !== type
    )
    if (wrongType.length > 0) {
      res.status(400).json({
        errors: wrongType.map(({ key, type }) => ({
          key,
          message: `Wrong type of key "${key}". Recieved "${typeof req.body[
            key
          ]}", expected "${type}".`,
        })),
      })
      return
    }

    const {
      chainId,
      serverId,
      address,
      roleId,
      tokenAddress,
      recieverAddress,
    }: Body = req.body
    // Is there a deployed airdrop contract on the chain
    if (!AirdropAddresses[Chains[chainId]]) {
      res.status(400).json({
        errors: [
          {
            key: "chainId",
            message: `No airdrop contract on network ${Chains[chainId]}.`,
          },
        ],
      })
      return
    }

    try {
      const [ownerId, discordId] = await Promise.all([
        fetchOwnerId("ownerId", serverId),
        fetchDiscordID("discordId", address),
        fetchRoles("", serverId).then((roles) => {
          if (!(roleId in roles)) {
            throw Error("Not valid role of server")
          }
        }),
      ])

      if (ownerId !== discordId) {
        res.status(400).json({
          errors: [{ key: "address", message: "Not the owner of the server." }],
        })
        return
      }

      const payload = defaultAbiCoder.encode(
        ["address", "string", "string", "address", "address", "address"],
        [
          AirdropAddresses[Chains[chainId]],
          serverId,
          roleId,
          recieverAddress,
          tokenAddress,
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
      res.status(500).json({
        errors: [{ message: error.message }],
      })
    }
  } else
    res
      .status(501)
      .send(`Method ${req.method} is not implemented for this endpoint.`)
}

export default handler