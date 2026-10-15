import { Link } from "@tanstack/react-router";
import { config } from "@/config/config";

const { CONTACT_NUMBER, PHYSICAL_ADDRESS, EMAIL_ADDRESS } = config;

const columns = [
  {
    heading: "Ministry",
    links: [
      { label: "About Ministry", to: "/about" },
      { label: "Leadership", to: "/leadership" },
      { label: "Departments", to: "/departments" },
      { label: "Services", to: "/services" },
    ],
  },
  {
    heading: "Civil Registration",
    links: [
      { label: "Birth Certificates", to: "/services/birth-certificates" },
      { label: "National ID", to: "/services/national-id" },
      { label: "Passports", to: "/services/passports" },
      { label: "Marriage Certificates", to: "/services" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Downloads", to: "/resources/downloads" },
      { label: "Requirements", to: "/resources/requirements" },
      { label: "Fees", to: "/resources/fees" },
      { label: "FAQs", to: "/resources/faqs" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Office Directory", to: "/offices" },
      { label: "Track Application", to: "/track-application" },
    ],
  },
];

const govLinks = [
  { label: "Zimbabwe Government", href: "#" },
  { label: "Parliament of Zimbabwe", href: "#" },
  { label: "Zimbabwe Republic Police", href: "#" },
  { label: "National Archives", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-ebony-950 text-white/70">
      <div className="container-gov grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full text-gold-400">
              <img src="/COA.svg" />
            </span>
            <span className="font-display text-sm font-bold text-white">
              Ministry of Home Affairs
              <br />
              &amp; Cultural Heritage
            </span>
          </div>
          <p className="mt-4 text-sm text-white/50">{PHYSICAL_ADDRESS}</p>
          <p className="mt-1 text-sm text-white/50">{CONTACT_NUMBER}</p>
          <p className="mt-1 text-sm text-white/50">{EMAIL_ADDRESS}</p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-bold uppercase tracking-wide text-gold-400">
              {col.heading}
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wide text-gold-400">
            Government Links
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {govLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-gov flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Ministry of Home Affairs and Cultural
            Heritage, Republic of Zimbabwe.
          </p>
          <p>
            This is a citizen-services prototype. All data shown is
            illustrative.
          </p>
        </div>
      </div>
    </footer>
  );
}
