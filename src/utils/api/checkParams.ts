import { NextApiRequest, NextApiResponse } from "next"

type RequiredBody = Array<{
  key: string
  type: string
}>

const stringArrayTypeCheck = (data: any) => {
  if (!Array.isArray(data)) return false
  return data.every((item) => typeof item === "string")
}

const checkParams = (
  req: NextApiRequest,
  res: NextApiResponse,
  requiredBody: RequiredBody
): boolean => {
  const missingKeys = requiredBody.filter(({ key }) => !(key in req.body))
  if (missingKeys.length > 0) {
    res.status(400).json({
      errors: missingKeys.map(({ key }) => ({
        key,
        message: `Key "${key}" missing.`,
      })),
    })
    return false
  }

  const wrongType = requiredBody.filter(({ key, type }) => {
    if (type === "string[]") return !stringArrayTypeCheck(req.body[key])
    return typeof req.body[key] !== type
  })
  if (wrongType.length > 0) {
    res.status(400).json({
      errors: wrongType.map(({ key, type }) => ({
        key,
        message: `Wrong type of key "${key}". Recieved "${typeof req.body[
          key
        ]}", expected "${type}".`,
      })),
    })
    return false
  }

  return true
}

export default checkParams
