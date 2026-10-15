import { useEffect, useState } from 'react'
import { CheckCircle2, KeyRound, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { OTP_TTL_SECONDS } from '@/api/auth.api'
import { useRequestPhoneVerification, useVerifyPhone } from '@/hooks/useAuth'

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Two-step phone verification: request a one-time code, then submit it.
 * The backend only allows one live code at a time (valid for 5 minutes), so
 * "resend" stays disabled until that window has passed.
 */
export function PhoneVerification({ phone }: { phone: string }) {
  const requestOtp = useRequestPhoneVerification()
  const verifyOtp = useVerifyPhone()

  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [otp, setOtp] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const sendCode = () => {
    verifyOtp.reset()
    requestOtp.mutate(undefined, {
      onSuccess: () => {
        setShowCodeEntry(true)
        setSecondsLeft(OTP_TTL_SECONDS)
      },
      // The backend rejects a new request while a valid code already
      // exists — that's not a dead end, the citizen can still enter it.
      onError: () => setShowCodeEntry(true),
    })
  }

  const otpIsValid = /^\d{4,8}$/.test(otp)

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpIsValid) return
    verifyOtp.mutate(otp)
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <p className="flex items-start gap-2 text-sm text-slate-500">
        <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span>
          We'll send a one-time code to{' '}
          <strong className="text-charcoal-900">{phone || 'your phone number'}</strong>. The code is valid for 5 minutes.
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant={showCodeEntry ? 'secondary' : 'primary'}
          onClick={sendCode}
          loading={requestOtp.isPending}
          disabled={secondsLeft > 0}
        >
          {showCodeEntry ? 'Resend Code' : 'Send Verification Code'}
        </Button>
        {secondsLeft > 0 && (
          <span className="text-xs text-slate-500" aria-live="polite">
            You can request a new code in {formatCountdown(secondsLeft)}
          </span>
        )}
        {!showCodeEntry && (
          <button
            type="button"
            className="text-xs font-semibold text-forest-700 hover:underline"
            onClick={() => setShowCodeEntry(true)}
          >
            I already have a code
          </button>
        )}
      </div>

      {requestOtp.isSuccess && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-forest-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Code sent. Enter it below.
        </p>
      )}
      {requestOtp.isError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {(requestOtp.error as Error).message || "We couldn't send a code. Please try again."}
        </p>
      )}

      {showCodeEntry && (
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submitCode}>
          <div className="flex-1">
            <FormField label="Verification Code" htmlFor="phone-otp" hint="Enter the numeric code we sent you.">
              <input
                id="phone-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className={inputClass(verifyOtp.isError)}
              />
            </FormField>
          </div>
          <Button type="submit" size="md" loading={verifyOtp.isPending} disabled={!otpIsValid}>
            <KeyRound className="h-4 w-4" aria-hidden="true" /> Verify
          </Button>
        </form>
      )}
      {verifyOtp.isError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {(verifyOtp.error as Error).message || 'That code could not be verified. Please check it and try again.'}
        </p>
      )}
    </div>
  )
}
