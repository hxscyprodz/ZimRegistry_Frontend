import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronRight } from "lucide-react";
import { UtilityBar } from "./UtilityBar";
import { MegaMenuTrigger } from "./MegaMenu";
import { EServicesMenu } from "./EServicesMenu";
import { megaMenu } from "./nav-data";

const simpleLinks = [
  { label: "Home", to: "/" as const },
  { label: "About Us", to: "/about" as const },
  { label: "News & Notices", to: "/news" as const },
  { label: "Contact", to: "/contact" as const },
];

const megaSections = megaMenu.filter((s) =>
  [
    "Leadership & Governance",
    "Civil Registration & Services",
    "Departments",
    "Resources",
  ].includes(s.label),
);

export function GovernmentHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <UtilityBar />
      <div className="border-b border-slate-100">
        <div className="container-gov flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gold-400">
              <img src="/COA.svg" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold text-forest-700 sm:text-base">
                Ministry of Home Affairs &amp; Cultural Heritage
              </span>
              <span className="block text-xs font-medium text-gold-600">
                Central Registry · Registrar General's Office
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <EServicesMenu />
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-2 text-forest-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav
        className="hidden border-b border-slate-100 lg:block"
        aria-label="Primary"
      >
        <div className="container-gov flex items-center gap-6">
          <Link
            to="/"
            className="py-2 text-sm font-medium text-charcoal-900 hover:text-forest-700"
          >
            Home
          </Link>
          {megaSections.map((section) => (
            <MegaMenuTrigger key={section.label} section={section} />
          ))}
          <Link
            to="/news"
            className="py-2 text-sm font-medium text-charcoal-900 hover:text-forest-700"
          >
            News &amp; Notices
          </Link>
          <Link
            to="/contact"
            className="py-2 text-sm font-medium text-charcoal-900 hover:text-forest-700"
          >
            Contact
          </Link>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal-900/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-forest-700">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 text-charcoal-900 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link
              to="/e-services"
              onClick={() => setDrawerOpen(false)}
              className="mt-5 rounded-[var(--radius-control)] bg-gold-400 px-4 py-3 text-center text-sm font-bold text-charcoal-900"
            >
              e-Services
            </Link>

            <div className="mt-4 flex flex-col divide-y divide-slate-100">
              {simpleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  className="py-3 text-sm font-medium text-charcoal-900"
                >
                  {link.label}
                </Link>
              ))}
              {megaMenu.map((section) => (
                <details key={section.label} className="py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 text-sm font-medium text-charcoal-900">
                    {section.label}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </summary>
                  <div className="flex flex-col gap-1 pb-2 pl-3">
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setDrawerOpen(false)}
                        className="py-1.5 text-sm text-slate-600"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
