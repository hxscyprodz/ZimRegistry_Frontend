import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Select } from '@/components/ui/Select'
import { childDetailsSchema, type ChildDetailsFormValues } from '@/schemas/birth-certificate.schema'
import { useBirthApplicationStore } from '@/stores/birthApplicationStore'
import { useHospitals, useStations, useDistricts } from '@/hooks/useLocations'

export function ChildDetailsStep({ onNext }: { onNext: () => void }) {
  const childDetails = useBirthApplicationStore((s) => s.childDetails)
  const setChildDetails = useBirthApplicationStore((s) => s.setChildDetails)

  const { data: hospitals, isLoading: isLoadingHospitals, isError: isHospitalsError, refetch: refetchHospitals } = useHospitals()
  const { data: stations, isLoading: isLoadingStations, isError: isStationsError, refetch: refetchStations } = useStations()
  const { data: districts, isLoading: isLoadingDistricts, isError: isDistrictsError, refetch: refetchDistricts } = useDistricts()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildDetailsFormValues>({
    resolver: zodResolver(childDetailsSchema),
    defaultValues: childDetails,
  })

  const onSubmit = (values: ChildDetailsFormValues) => {
    const hospitalName = hospitals?.find((h) => h.id === values.hospital)?.name
    const station = stations?.find((s) => s.id === values.station)
    const districtOfOriginName = districts?.find((d) => d.id === values.districtOfOrigin)?.name
    setChildDetails({
      ...values,
      middleNames: values.middleNames || undefined,
      hospitalName,
      stationName: station ? `${station.name} — ${station.district.name}` : undefined,
      districtOfOriginName,
    })
    onNext()
  }

  const locationsError = isHospitalsError || isStationsError || isDistrictsError

  return (
    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-charcoal-900 sm:col-span-2">Child Information</h2>

      <FormField label="First Name" htmlFor="firstName" required error={errors.firstName?.message}>
        <input id="firstName" className={inputClass(!!errors.firstName)} {...register('firstName')} />
      </FormField>
      <FormField label="Middle Name(s)" htmlFor="middleNames">
        <input id="middleNames" className={inputClass()} {...register('middleNames')} />
      </FormField>
      <FormField label="Surname" htmlFor="surname" required error={errors.surname?.message}>
        <input id="surname" className={inputClass(!!errors.surname)} {...register('surname')} />
      </FormField>
      <FormField label="Sex" htmlFor="sex" required error={errors.sex?.message}>
        <Select id="sex" hasError={!!errors.sex} defaultValue="" {...register('sex')}>
          <option value="" disabled>Select sex</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </Select>
      </FormField>
      <FormField label="Date of Birth" htmlFor="dateOfBirth" required error={errors.dateOfBirth?.message}>
        <input id="dateOfBirth" type="date" className={inputClass(!!errors.dateOfBirth)} {...register('dateOfBirth')} />
      </FormField>

      <FormField label="Place of Birth" htmlFor="placeOfBirth" required error={errors.placeOfBirth?.message} hint="Town or city where the child was born.">
        <input id="placeOfBirth" className={inputClass(!!errors.placeOfBirth)} {...register('placeOfBirth')} />
      </FormField>
      <FormField label="Village of Origin" htmlFor="villageOfOrigin" required error={errors.villageOfOrigin?.message}>
        <input id="villageOfOrigin" className={inputClass(!!errors.villageOfOrigin)} {...register('villageOfOrigin')} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Home Address" htmlFor="address" required error={errors.address?.message}>
          <input id="address" className={inputClass(!!errors.address)} {...register('address')} />
        </FormField>
      </div>

      {locationsError ? (
        <div className="flex items-start gap-2 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:col-span-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p>We couldn't load hospitals, stations and districts. Please check your connection and try again.</p>
            <button
              type="button"
              onClick={() => {
                refetchHospitals()
                refetchStations()
                refetchDistricts()
              }}
              className="mt-1 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <FormField label="District of Origin" htmlFor="districtOfOrigin" required error={errors.districtOfOrigin?.message} hint="The child's home/ancestral district.">
            <Select id="districtOfOrigin" hasError={!!errors.districtOfOrigin} disabled={isLoadingDistricts} defaultValue="" {...register('districtOfOrigin')}>
              <option value="" disabled>{isLoadingDistricts ? 'Loading districts…' : 'Select a district'}</option>
              {districts?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Hospital of Birth" htmlFor="hospital" required error={errors.hospital?.message}>
            <Select id="hospital" hasError={!!errors.hospital} disabled={isLoadingHospitals} defaultValue="" {...register('hospital')}>
              <option value="" disabled>{isLoadingHospitals ? 'Loading hospitals…' : 'Select a hospital'}</option>
              {hospitals?.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Station for Collection" htmlFor="station" required error={errors.station?.message}>
            <Select id="station" hasError={!!errors.station} disabled={isLoadingStations} defaultValue="" {...register('station')}>
              <option value="" disabled>{isLoadingStations ? 'Loading stations…' : 'Select a station'}</option>
              {stations?.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.district.name}</option>
              ))}
            </Select>
          </FormField>
        </>
      )}

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={locationsError}>Continue</Button>
      </div>
    </form>
  )
}
