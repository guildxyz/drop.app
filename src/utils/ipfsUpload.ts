import https from "https"
import { CID, create } from "ipfs-http-client"
import { HTTPClientExtraOptions } from "ipfs-http-client/types/src/types"

// Couldn only import these types from "node_modules/ipfs-core-types/src/root.ts" by relative path, figured its better this way
type AddOptions = {
  chunker?: string
  cidVersion?: 0 | 1
  hashAlg?: string
  onlyHash?: boolean
  pin?: boolean
  progress?: (bytes: number, path?: string) => void
  rawLeaves?: boolean
  trickle?: boolean
  wrapWithDirectory?: boolean
  preload?: boolean
  blockWriteConcurrency?: number
  signal?: AbortSignal
  timeout?: number
}

type AddResult = {
  cid: CID
  size: number
  path: string
  mode?: number
  mtime?: {
    secs: number
    nsecs?: number
  }
}

const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  agent: new https.Agent({ keepAlive: true }),
  /* headers: {
    "Authorization": "Basic <base64(USERNAME:PASSWORD)>"
  } */
})

const ipfsUpload = (
  buffer: ArrayBuffer,
  onProgress?: (progress: number) => void,
  addOptions?: AddOptions & HTTPClientExtraOptions
): Promise<AddResult> =>
  client.add(buffer, {
    ...addOptions,
    progress: (bytes, path) => {
      onProgress?.(bytes / buffer.byteLength)
      addOptions?.progress?.(bytes, path)
    },
  })

export { client } // For debugging, won't be needed later
export default ipfsUpload
