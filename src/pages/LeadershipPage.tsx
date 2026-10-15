import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { User } from "lucide-react";

const leaders = [
  {
    role: "Minister of Home Affairs and Cultural Heritage",
    name: "Hon. Kazembe Kazembe",
  },
  { role: "Deputy Minister", name: "Hon. Chido Sanyatwe" },
  { role: "Permanent Secretary", name: "Ambassador R.T. Faranisi" },
];

export function LeadershipPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Leadership & Governance" }]} />
      <div className="container-gov py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">
          Leadership &amp; Governance
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          The Ministry's leadership provides strategic direction across civil
          registration, immigration, policing and cultural heritage functions.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {leaders.map((leader) => (
            <div
              key={leader.role}
              className="card-gov flex flex-col items-center gap-3 p-6 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/10 text-forest-600">
                <User className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-semibold text-charcoal-900">
                {leader.name}
              </h2>
              <p className="text-xs text-slate-500">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
