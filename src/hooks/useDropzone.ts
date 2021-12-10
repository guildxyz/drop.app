import { useEffect, useRef, useState } from "react"
import { DropzoneOptions, useDropzone as useReactDropzone } from "react-dropzone"
import { v4 as uuidv4 } from "uuid"

type Props = {
  maxSizeMb?: number
  onUploadError?: (error?: Error) => void
} & DropzoneOptions

interface UploadedFile extends File {
  preview: string
  hash?: string
}

const uploadImages = async (
  files: File[],
  clientId: number,
  ids: string[]
): Promise<string[]> => {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(ids[index], file))

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_UPLOADER_API}/${clientId}`,
    {
      method: "POST",
      body: formData,
    }
  )

  const body = await response.json()

  if (response.ok) return body
  else throw Error(body.message ?? "Failed to upload images")
}

const useDropzone = ({
  onUploadError = () => {},
  maxSizeMb = 10,
  ...dropzoneOptions
}: Props = {}) => {
  // Needed to handle SSE
  const progressEventSource = useRef<EventSource | null>(null)
  const uploadProgressId = useRef<number>(+Date.now())

  const [files, setFiles] = useState<Record<string, UploadedFile>>({})
  const [progresses, setProgresses] = useState<Record<string, number>>({})

  // Start uploading files on drop event. After the POST request, the backend will start sending SSE messages
  const dropzone = useReactDropzone({
    ...dropzoneOptions,
    accept: dropzoneOptions.accept ?? "image/*",
    noClick: dropzoneOptions.noClick ?? true,
    maxSize: dropzoneOptions.maxSize ?? maxSizeMb * 1024 * 1024,
    onDrop: (acceptedFilesOfDrop, fileRejections, event) => {
      const newUploadedFiles = acceptedFilesOfDrop.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }))

      const ids: string[] = newUploadedFiles.map(() => uuidv4())

      setFiles((prev) => ({
        ...prev,
        ...Object.fromEntries(
          newUploadedFiles.map((file, index) => [ids[index], file])
        ),
      }))

      uploadImages(acceptedFilesOfDrop, uploadProgressId.current, ids).catch(
        onUploadError
      )

      dropzoneOptions.onDrop?.(acceptedFilesOfDrop, fileRejections, event)
    },
  })

  // Set up SSE client on mount
  useEffect(() => {
    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_UPLOADER_API}/${uploadProgressId.current}`
    )

    source.addEventListener("progress", (event) => {
      const [id, progress] = JSON.parse((event as Event & { data: string }).data)

      setProgresses((prev) => ({
        ...prev,
        [id]: progress,
      }))
    })

    source.addEventListener("hash", (event) => {
      const [id, hash] = JSON.parse((event as Event & { data: string }).data)

      setFiles((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          hash,
        },
      }))
    })

    progressEventSource.current = source
  }, [])

  // Disconnect SSE on unmount
  useEffect(() => () => progressEventSource.current?.close(), [progressEventSource])

  return { ...dropzone, files, progresses }
}

export default useDropzone
