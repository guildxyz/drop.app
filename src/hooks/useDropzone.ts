import { useCallback, useState } from "react"
import {
  DropEvent,
  DropzoneOptions,
  FileRejection,
  useDropzone as useReactDropzone,
} from "react-dropzone"
import { v4 as uuidv4 } from "uuid"

type Props = {
  maxSizeMb?: number
  onUploadError?: (error?: Error) => void
  onDrop?: (
    acceptedFiles: Array<File & { id: string }>,
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void
} & Omit<DropzoneOptions, "onDrop">

export interface UploadedFile extends File {
  preview: string
  progress: number
  hash?: string
}

const uploadImages = async (
  files: File[],
  clientId: string,
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
  const [files, setFiles] = useState<Record<string, UploadedFile>>({})

  const setupEventSource = useCallback((clientId: string) => {
    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_UPLOADER_API}/${clientId}`
    )

    const progressHandler = (event) => {
      const [id, progress] = JSON.parse((event as Event & { data: string }).data)
      setFiles((prev) => ({ ...prev, [id]: { ...prev[id], progress } }))
    }

    const hashHandler = (event) => {
      const [id, hash] = JSON.parse((event as Event & { data: string }).data)
      setFiles((prev) => ({ ...prev, [id]: { ...prev[id], hash } }))
    }

    source.addEventListener("progress", progressHandler)
    source.addEventListener("hash", hashHandler)
    return source
  }, [])

  // Start uploading files on drop event. After the POST request, the backend will start sending SSE messages
  const dropzone = useReactDropzone({
    ...dropzoneOptions,
    accept: dropzoneOptions.accept ?? "image/*",
    noClick: dropzoneOptions.noClick ?? true,
    maxSize: dropzoneOptions.maxSize ?? maxSizeMb * 1024 * 1024,
    onDrop: (acceptedFilesOfDrop, fileRejections, event) => {
      const uploadProgressId = uuidv4()
      const progressEventSource = setupEventSource(uploadProgressId)

      const newUploadedFiles = acceptedFilesOfDrop.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }))

      const ids: string[] = newUploadedFiles.map(() => uuidv4())

      setFiles((prev) => ({
        ...prev,
        ...Object.fromEntries(
          newUploadedFiles.map((file, index) => [ids[index], file])
        ),
      }))

      // Intentionally not awaiting here
      uploadImages(acceptedFilesOfDrop, uploadProgressId, ids)
        .catch(onUploadError)
        .finally(() => progressEventSource.close())

      dropzoneOptions.onDrop?.(
        acceptedFilesOfDrop.map((file, index) => ({ ...file, id: ids[index] })),
        fileRejections,
        event
      )
    },
  })

  return { ...dropzone, files }
}

export default useDropzone
