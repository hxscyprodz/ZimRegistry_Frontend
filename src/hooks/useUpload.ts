import { useMutation } from '@tanstack/react-query'
import { uploadDocument } from '@/api/upload.api'

export function useUploadDocument() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: string }) => uploadDocument(file, folder),
  })
}
