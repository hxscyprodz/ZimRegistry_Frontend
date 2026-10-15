import { useRef, useState, type DragEvent } from 'react'
import { UploadCloud, FileCheck2, X, RefreshCw, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUploadDocument } from '@/hooks/useUpload'
import { ACCEPTED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB, UploadValidationError, deleteDocument } from '@/api/upload.api'

function displayNameFromUrl(url: string): string {
  try {
    const path = decodeURIComponent(new URL(url).pathname)
    return path.split('/').pop() || url
  } catch {
    return url
  }
}

/**
 * Controlled file upload field. Uploads directly to Supabase Storage
 * (see api/upload.api.ts) and reports the resulting public URL back via
 * `onChange` — the value this component holds is always a URL string (or
 * undefined), never the raw File.
 */
export function FileUploader({
  label,
  folder,
  value,
  onChange,
  hasError,
  required,
}: {
  label: string
  /** Storage sub-folder for this document type, e.g. "national-id/id-photo". */
  folder: string
  value?: string
  onChange: (url: string | undefined) => void
  hasError?: boolean
  required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const upload = useUploadDocument()

  const handleFile = (file: File) => {
    setFileName(file.name)
    upload.mutate(
      { file, folder },
      {
        onSuccess: (url) => onChange(url),
        onError: () => onChange(undefined),
      },
    )
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const remove = () => {
    // Fire-and-forget: the file was already successfully uploaded, and the
    // citizen has decided not to use it — clean it up rather than leaving
    // an orphaned object in the bucket. Never blocks the UI on this.
    if (value) {
      deleteDocument(value).catch(() => {})
    }
    setFileName(null)
    upload.reset()
    onChange(undefined)
  }

  const isUploaded = !!value && !upload.isPending
  const isEmpty = !value && !upload.isPending && !upload.isError
  const errorMessage = upload.isError
    ? upload.error instanceof UploadValidationError
      ? upload.error.message
      : (upload.error as Error).message || 'Upload failed. Please try again.'
    : undefined

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-charcoal-900">
        {label} {required && <span className="text-forest-600">*</span>}
      </p>

      {(isEmpty || upload.isError) && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex flex-col items-center gap-2 rounded-[var(--radius-card)] border-2 border-dashed px-4 py-8 text-center transition-colors',
            isDragging ? 'border-forest-500 bg-forest-50' : hasError ? 'border-red-300 bg-red-50/40' : 'border-slate-300 bg-slate-50',
          )}
        >
          <UploadCloud className="h-7 w-7 text-forest-600" aria-hidden="true" />
          <p className="text-sm text-slate-600">
            Drag and drop the file here, or{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-forest-700 underline underline-offset-2"
            >
              browse your device
            </button>
          </p>
          <p className="text-xs text-slate-400">JPG, PNG, WEBP or PDF — up to {MAX_DOCUMENT_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
            className="sr-only"
            aria-label={`Upload ${label}`}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {(upload.isPending || isUploaded) && (
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {isUploaded ? (
              <FileCheck2 className="h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-5 w-5 shrink-0 animate-spin text-gold-600" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-charcoal-900">
                {fileName ?? (value ? displayNameFromUrl(value) : '')}
              </p>
              <p className="text-xs text-slate-400">{upload.isPending ? 'Uploading…' : 'Uploaded'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={upload.isPending}
            aria-label={`Remove ${label}`}
            className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600" role="alert">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}
    </div>
  )
}
