import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FormField, inputClass } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { config } from "@/config/config";

const { PHYSICAL_ADDRESS, EMAIL_ADDRESS, CONTACT_NUMBER } = config;

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Contact Us</h1>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="card-gov flex items-start gap-3 p-5">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-forest-600"
                aria-hidden="true"
              />
              <p className="text-sm text-slate-600">{PHYSICAL_ADDRESS}</p>
            </div>
            <div className="card-gov flex items-start gap-3 p-5">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-forest-600"
                aria-hidden="true"
              />
              <p className="text-sm text-slate-600">{CONTACT_NUMBER}</p>
            </div>
            <div className="card-gov flex items-start gap-3 p-5">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0 text-forest-600"
                aria-hidden="true"
              />
              <p className="text-sm text-slate-600">{EMAIL_ADDRESS}</p>
            </div>
          </div>

          <div className="card-gov p-6 lg:col-span-2">
            {submitted ? (
              <div className="py-8 text-center">
                <h2 className="text-lg font-semibold text-charcoal-900">
                  Thank you — your message has been sent.
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Our team will respond during working hours.
                </p>
              </div>
            ) : (
              <form
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <FormField label="Full Name" htmlFor="name" required>
                  <input id="name" required className={inputClass()} />
                </FormField>
                <FormField label="Email Address" htmlFor="email" required>
                  <input
                    id="email"
                    type="email"
                    required
                    className={inputClass()}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Subject" htmlFor="subject" required>
                    <input id="subject" required className={inputClass()} />
                  </FormField>
                </div>
                <div className="sm:col-span-2">
                  <FormField label="Message" htmlFor="message" required>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      className={inputClass()}
                    />
                  </FormField>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
