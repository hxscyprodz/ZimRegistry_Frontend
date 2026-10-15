import { supabase, getSupabaseConfigError } from '@/lib/supabase'

export const ACCEPTED_DOCUMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const MAX_DOCUMENT_SIZE_MB = 8

const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined) ?? 'application-documents'

export class UploadValidationError extends Error {}

function validateFile(file: File) {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    throw new UploadValidationError('Please use a JPG, PNG, WEBP or PDF file.')
  }
  if (file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024) {
    throw new UploadValidationError(`Please keep files under ${MAX_DOCUMENT_SIZE_MB}MB.`)
  }
}

/**
 * Uploads a document directly to Supabase Storage from the browser and
 * returns its public URL, which is what gets sent to our own backend as
 * e.g. `birthCertificateImageUrl` — the backend itself never touches the
 * file.
 *
 * `folder` organizes uploads within the bucket, e.g.
 * "national-id/id-photo" or "birth-certificate/mothers-id" — purely for
 * tidiness in the Supabase dashboard, has no effect on access control.
 *
 * Requires the bucket's Storage policies to allow inserts from the anon
 * role (our own backend has its own separate auth — this app never
 * authenticates with Supabase itself, so RLS must be written accordingly,
 * e.g. "allow insert for anon" scoped to this bucket, with public read for
 * the uploaded files to be viewable via their returned URL).
 */
export async function uploadDocument(file: File, folder: string): Promise<string> {
  validateFile(file)

  const configError = getSupabaseConfigError()
  if (configError) {
    throw new Error(configError)
  }
  if (!supabase) {
    throw new Error('File upload is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  if (/^https?:\/\//.test(STORAGE_BUCKET)) {
    throw new Error(
      'VITE_SUPABASE_STORAGE_BUCKET looks like a URL, not a bucket name. It should just be the bucket\'s plain ' +
        'name, e.g. "application-documents" — find it under the Storage tab in your Supabase dashboard.',
    )
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop() : undefined
  const fileName = `${crypto.randomUUID()}${extension ? `.${extension}` : ''}`
  const path = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (uploadError) {
    if (/row-level security/i.test(uploadError.message)) {
      throw new Error(
        `Uploads aren't permitted yet for the "${STORAGE_BUCKET}" bucket. Add a Storage policy allowing ` +
          'INSERT for the anon role on this bucket in the Supabase dashboard (Storage → your bucket → Policies).',
      )
    }
    throw new Error(uploadError.message || 'Upload failed. Please try again.')
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Deletes a previously-uploaded document from Supabase Storage, given its
 * public URL — used to clean up files that were uploaded but never ended
 * up part of a successfully submitted application (the applicant removed
 * it, replaced it, or abandoned the form after uploading).
 *
 * Deliberately never throws — cleanup failing shouldn't disrupt the
 * citizen's flow, it just means an orphaned file needs clearing out
 * another way later (e.g. a periodic server-side sweep of unreferenced
 * objects, which is worth having regardless since this client-side
 * cleanup can't catch every case — see the note on tab-close in
 * FileUploader's usage).
 */
export async function deleteDocument(publicUrl: string): Promise<void> {
  if (!supabase) return

  const marker = `/object/public/${STORAGE_BUCKET}/`
  const markerIndex = publicUrl.indexOf(marker)
  if (markerIndex === -1) {
    console.warn('[upload] Could not determine the storage path from URL, skipping cleanup:', publicUrl)
    return
  }

  const path = decodeURIComponent(publicUrl.slice(markerIndex + marker.length))
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
  if (error) {
    console.warn('[upload] Failed to delete document during cleanup:', error.message)
  }
}
