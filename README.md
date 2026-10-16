# Ministry of Home Affairs & Cultural Heritage — Central Registry Citizen Portal

A frontend prototype for a modern citizen-services portal for Zimbabwe's Ministry of Home Affairs and
Cultural Heritage, focused on Central Registry civil registration services (birth certificates and
National ID).

This is a **frontend-only prototype**. There is no real backend, no real authentication, no real
document storage, and no real payment processing. All data is served from an in-memory mock API layer
designed to be swapped for real REST endpoints with minimal changes.

## Run it

### Local Development

```bash
bun install
bun run dev
```

*(or `npm install && npm run dev`)*

Then open the printed local URL. `bun run build` produces a production build in `dist/`.

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Available variables:
- `VITE_API_BASE_URL`: Base URL for the backend API (e.g. `https://zimreg-backend-1.onrender.com`). If left empty, API requests default to relative `/api/...`.
- `VITE_SUPABASE_URL`: Supabase project URL for document storage.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key for client-side document uploads.
- `VITE_SUPABASE_STORAGE_BUCKET`: Storage bucket name (defaults to `application-documents` if omitted).
- `VITE_ORG_ADDRESS`, `VITE_ORG_PHONE`, `VITE_ORG_EMAIL`: Ministry contact details.

### Run with Docker

Docker Compose automatically reads environment variables from your `.env` file via `env_file: .env`:

```bash
docker compose up -d --build
```

The portal will be accessible at `http://localhost:3000`.

Alternatively, build and run directly with Docker passing your `.env` file:

```bash
# 1. Build the image with build args from your environment
docker build --build-arg-file .env -t zimregistry-frontend .

# 2. Run the container
docker run -d -p 3000:80 --name zimregistry_frontend zimregistry-frontend
```

### Deploying to Vercel

1. Import this repository in Vercel as a Vite project.
2. Under **Project Settings → Environment Variables**, add your environment variables (from `.env.example`).
3. Deploy! The included `vercel.json` ensures both API proxy rewrites and SPA fallback routing for client-side pages work seamlessly.

## What's implemented

- **Public site**: homepage, About, Leadership, Departments, Civil Registration Services (+ detail pages
  for Birth Certificates / National ID / Passports), Resources & Downloads (with search/filter), News &
  Public Notices, Office Finder (province/district/service filters), Contact, global Search.
- **e-Services**: e-Services hub, a 4-step Birth Certificate application wizard (child details → parent
  details → document upload → review & submit), a 2-step National ID application, and owner-only application
  tracking by reference number with a visual timeline and status states (including "additional
  information required" and "rejected").
- **Citizen accounts**: register, login, forgot password, protected routes, a citizen dashboard with
  application summary counts and recent applications, a full "My Applications" list with search/filter/
  sort, application detail view (with masked National ID numbers), and a profile page.
- **Design system**: the header (utility bar, mega menus, e-Services CTA, mobile drawer), footer,
  ApplicationStatus/ApplicationTimeline/StepIndicator components, file uploader with drag-and-drop and
  validation, form fields with accessible error messages, skeleton/empty/error states, breadcrumbs, and
  more — all built on the Ministry's forest green / gold / charcoal palette with Poppins/Inter type.

## Architecture

- `src/api/*.api.ts` — one module per resource. **Connected to the real backend** (`hxscyprodz/ZimReg_Backend` — a full rewrite of the earlier `ZimRegistry_Backend`, different routes/shapes/auth model entirely) as of this build:
  - `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/refresh` (`auth.api.ts`). Login/register now require a `platform: "citizen-portal"` field, since this backend also serves a separate registrar staff dashboard from the same endpoints. Logout and refresh are both newly real — logout actually clears the session cookies server-side now (previously impossible from the frontend alone, since the cookie is httpOnly), and refresh exchanges the refresh-token cookie for a new access token.
  - `GET /api/v1/profile`, `PUT /api/v1/profile` (`profile.api.ts`) — bundles the citizen's profile **and** their applications list + stats in one response; there's no separate "list my applications" endpoint, so `applications.api.ts`'s `list()` reads from here. `role` was removed from this response in a backend permissions rework — `ProfileResponse['profile'].role` is now optional to match (already handled gracefully; nothing in the UI depended on it being present).
  - `GET /api/v1/districts`, `GET /api/v1/provinces`, `GET /api/v1/stations`, `GET /api/v1/hospitals` (`locations.api.ts`). **Stations are paginated** (`?page=&limit=`): `getStations()` walks pages of 50 until one adds nothing new, so the apply-form dropdowns still receive the full list; `getStationsPage(page, limit)` is there if a single page is ever wanted.
  - `POST /api/v1/applications/id`, `GET /api/v1/applications/id/:id` (`national-id.api.ts` / `applications.api.ts`) — National ID apply + detail. The detail call joins through to the linked birth certificate for the applicant's real name/DOB.
  - `POST /api/v1/applications/birth`, `GET /api/v1/applications/birth/:id` (`birth-certificates.api.ts` / `applications.api.ts`) — birth certificate apply + detail. The detail call joins through to the hospital, station, and both parents' birth certificates (father is a left join — nullable, since he's optional). `getById` picks the right detail endpoint automatically based on which service the application is. The apply form now also collects **Date of Birth** and **District of Origin** (a real district selector, separate from the collection Station) — both required by the backend's `CreateBirthCertificateApplication` validator. **Gap:** the detail endpoint (`GET .../birth/:id`) doesn't select either field back, even though creation requires them — so they only ever show up right after a successful submission, not when revisiting an application later. Worth adding to that endpoint's select list on the backend.
  - `PUT /api/v1/applications/id/:id` (`nationalIdApi.update`) — **correct and resubmit a rejected National ID application** (same application, not a new one). Body is `CreateIdApplication.partial()`, but only `nationalIdNumber` and `birthCertificateImageUrl` are applied (station is ignored). On success the backend sets the status back to `PENDING_REVIEW`, re-sends the "received" WhatsApp message and, if a new photo was sent, re-queues it for AI image validation (which can reject it again). Owner-only; `APPROVED`/`COLLECTED` can't be updated; a changed National ID number must differ from the current one, be registered on a birth certificate, not already hold a National ID and not already have another application. The UI (`features/national-id/EditNationalIdForm.tsx`, shown on the application detail page and linked from tracking) therefore sends only what changed, and offers the action only on `rejected` applications (the backend now restricts updates to rejected ones too). `GET /api/v1/applications/id/:id` also returns the rejection reason, which the detail page shows above the edit form — assumed to be named `rejectionReason` (as on the staff endpoint) and read from either the record or its `details`; if the backend uses a different name, adjust `applications.api.ts` (`getById`). Requires the citizen role to hold the `application:update` permission.
  - `PUT /api/v1/applications/birth/:id` (`birthCertificatesApi.update`) — **correct and resubmit a rejected birth certificate application**. Body is `CreateBirthCertificateApplication.partial()` (station isn't updatable). Owner-only, permission `application:update`, REJECTED applications only. The backend returns 400 for an empty body ("No update data provided") and when nothing differs from what's on file ("No changes found in the application"), so `EditBirthApplicationForm` sends only changed fields and keeps the Resubmit button disabled until something changes. On success the status becomes **`RESUBMITTED`** (mapped to "processing" in `backend-mapping.ts`), the "received" WhatsApp message is re-sent and any new document photos are re-queued for AI validation. Limits worth knowing: the detail endpoint doesn't return date of birth or district of origin, so those two fields can't be prefilled and mean "keep current" when left empty; a father's National ID can be corrected/added but not removed; an existing middle name can't be cleared. Response `application.id` is the details row's id, not the application id, so only `status` is read from it.
  - `GET /api/v1/applications/tracking/:trackingId` (`applications.api.ts`, `trackByReference`) — returns a real `createdAt`. **Owner-only:** it sits behind `Authenticate` *and* the backend now scopes the lookup to the signed-in user's id (tracking ids are sequential, so an unscoped lookup let anyone guess other citizens' applications). A citizen can only track applications submitted from their own account; someone else's reference behaves like "not found". `TrackApplicationPage` shows a sign-in prompt to signed-out visitors, the reference search box plus a clickable list of their own applications to signed-in citizens, and words "not found" as "not found on your account".

  **Auth model is httpOnly session cookies** (`accessToken` + `refreshToken`, `sameSite: strict`), not a Bearer token. `apiRequest` in `client.ts` just sends `credentials: 'include'` — nothing for the frontend to store or attach manually, which is a meaningfully stronger security posture (JS can never read the token at all).

  **Tracking ID prefixes** (confirmed against `GenerateID.ts`): birth certificates are `BT-`, National ID applications are `ID-`. (Not `BC-` — an assumption from an earlier build that turned out wrong once the real generator was checked.)

  **Phone-number verification** (replaces the old email verification — the backend switched the verification entity to phone, DB field `isPhoneNumberVerified`; `GET /api/v1/profile` still returns it under the legacy key `isEmailVerified`, and `profile.api.ts` accepts either). Two-step OTP flow, `authApi.requestPhoneVerification()` then `authApi.verifyPhone(otp)`, driven by the shared `PhoneVerification` component (used by `EligibilityGate` and the Profile page). The code is valid for 5 minutes and the backend rejects a new request while one is still valid, so the UI's resend button is locked for the same window. **Confirm the route paths and the verify body's field name** against the backend — they're isolated in the `PHONE_VERIFICATION` constant at the top of `auth.api.ts` (currently `POST /api/v1/auth/request-phone-verification`, `POST /api/v1/auth/verify-phone`, body `{ otp }`). `Citizen.emailVerified` is now `Citizen.phoneVerified`.

  **Not connected — no equivalent endpoint exists on this backend yet:** forgot/reset password.

  **Document uploads** now go straight from the browser to Supabase Storage, bypassing our own backend entirely for the file itself — see `src/api/upload.api.ts` and `src/lib/supabase.ts`. Both apply endpoints only ever needed a URL (`birthCertificateImageUrl` for National ID; `hospitalRecordImageUrl` / `motherIdImageUrl` / `fatherIdImageUrl` for birth certificates), so this was always the natural fit rather than proxying large files through the Express API. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (see `.env.example`) to enable it — without them, `FileUploader` will show a clear "not configured yet" error instead of failing silently.

  **Orphaned upload cleanup:** `deleteDocument()` in `upload.api.ts` removes a file from Supabase Storage. It's called in three places — explicitly removing a document via `FileUploader`'s ✕ button; and, on both apply pages, an unmount effect that deletes any uploaded-but-unsubmitted document if the citizen navigates away without completing the application (tracked via a ref so a successful submission is never affected). **Known limitation:** none of this can catch a hard tab close or browser refresh — there's no reliable client-side hook for that. A periodic server-side sweep of Storage objects with no matching application record is the robust long-term fix for those cases, and is worth adding on the backend regardless of the client-side cleanup here.

  **Supabase setup required on your end:** create a Storage bucket (name it to match `VITE_SUPABASE_STORAGE_BUCKET`, or leave the env var unset to use the default `application-documents`), and add a Storage policy allowing `insert` for the `anon` role on that bucket — this app never authenticates with Supabase itself (its own Express backend has completely separate auth), so uploads happen as the anon role, and RLS must be written accordingly. You'll also want public read access on the bucket so the returned URLs are actually viewable by whoever reviews the application.
- `src/hooks/*` — TanStack Query hooks wrapping the API modules (`useApplications`, `useLogin`, `useSubmitBirthApplication`, `useDistricts`, `useStations`, `useProvinces`, `useUpdateProfile`, etc.). Components only ever talk to hooks, never to `api/` directly.
- `src/stores/*` — Zustand stores for client state only: `authStore` (session identity — no password or
  token is ever stored here), `birthApplicationStore` (in-progress multi-step form/document state, kept
  in memory only), `uiStore` (language, mobile menu).
- `src/schemas/*` — Zod validation schemas paired with React Hook Form in every form in the app.
- `src/routes/*` — TanStack Router file-based routes. `_public.*` files share the public `PublicLayout`;
  `_account.*` files are wrapped in `ProtectedRoute` + `DashboardLayout` and redirect to `/login` if not
  authenticated.
- `src/components/ui`, `src/components/shared`, `src/components/layout` — the reusable component library
  described in the brief (Button, Badge, ApplicationStatus, StepIndicator, FileUploader, ServiceCard,
  OfficeCard, GovernmentHeader, MegaMenu, Footer, etc).

## Try the flows

- Apply for a birth certificate: **e-Services → Apply for Birth Certificate**. Real backend call — needs a citizen account, real hospital and station selections (fetched live), both parents' National ID numbers matching existing birth certificate records (father optional), and real document uploads (see Supabase setup above).
- Apply for a National ID: **e-Services → Apply for National ID**. Real backend call — needs a citizen account whose National ID number matches an existing birth certificate record in the database, a real station (fetched live), and a real document upload (see Supabase setup above).
- Track an application: **Track Application** — requires sign-in and only finds the signed-in citizen's own applications. Signed-in citizens see a clickable list of them right on the page, alongside a search box for typing a reference number.
- Citizen account: **Register** or **Login** against the real backend (`hxscyprodz/ZimReg_Backend`) — registration requires the National ID number to match an existing birth certificate row seeded in that backend's database.

## Known gaps / next steps

- Content flagged with square brackets (e.g. `[Official Ministry Contact Number]`) is a placeholder for
  information that should come from the Ministry rather than be invented — see spec section 61.
- Death Certificates, Marriage Certificates and Citizenship Services are represented on the public site
  as informational cards only (per the brief, only Birth Certificate and National ID have full digital
  application flows in this phase).
- Document requirements shown in the Requirements Wizard and service detail pages are illustrative and
  are explicitly labelled as such in the UI; they should be replaced with officially confirmed
  requirements before this goes further than a prototype.
- No Registrar General / staff / admin dashboard is included — out of scope per the brief.
