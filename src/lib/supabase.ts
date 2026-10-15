import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Catches the specific, easy-to-make mistake of pasting the wrong kind of
 * Supabase connection string into VITE_SUPABASE_URL — e.g. the direct
 * Postgres connection string (which embeds a password, and which browsers
 * refuse to fetch()) or the S3-compatible storage endpoint. The JS client
 * needs the plain Project URL: https://<project-ref>.supabase.co
 */
function validateSupabaseUrl(url: string): string | null {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://') || url.includes('@db.')) {
    return 'VITE_SUPABASE_URL looks like a direct Postgres connection string, not the Supabase Project URL. ' +
      'It should look like https://your-project-ref.supabase.co — find it under Project Settings → API → Project URL.'
  }
  if (url.includes('.storage.supabase.co') || url.includes('/storage/v1/s3')) {
    return 'VITE_SUPABASE_URL looks like the S3-compatible storage endpoint, not the Supabase Project URL. ' +
      'It should look like https://your-project-ref.supabase.co — find it under Project Settings → API → Project URL.'
  }
  try {
    const parsed = new URL(url)
    if (parsed.username || parsed.password) {
      return 'VITE_SUPABASE_URL has credentials embedded in it, which browsers will refuse to use. ' +
        'It should just be https://your-project-ref.supabase.co with nothing else in it.'
    }
  } catch {
    return 'VITE_SUPABASE_URL is not a valid URL.'
  }
  return null
}

let supabaseConfigError: string | null = null
let client: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  const validationError = validateSupabaseUrl(supabaseUrl)
  if (validationError) {
    supabaseConfigError = validationError
    console.error(`[supabase] ${validationError}`)
  } else {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
}

/**
 * Client-side Supabase Storage client, used to upload application
 * documents (birth certificate images, National ID photos) directly from
 * the browser rather than proxying large files through our own API.
 *
 * The anon key is meant to be public — it's safe to ship in the frontend
 * bundle by design, same as any Supabase client-side app. What actually
 * controls who can upload/read is the Storage bucket's Row Level Security
 * policies on the Supabase project itself. See .env.example for the
 * required environment variables.
 *
 * `null` until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, or if
 * VITE_SUPABASE_URL is set to the wrong kind of Supabase connection string
 * (see validateSupabaseUrl above) — upload.ts surfaces `supabaseConfigError`
 * in that case instead of throwing a generic error.
 */
export const supabase: SupabaseClient | null = client
export const getSupabaseConfigError = () => supabaseConfigError
