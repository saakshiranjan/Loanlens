import { BarChart3, Eye, Lock, RefreshCw, Shield, TrendingUp, Zap } from "lucide-react";

const BENEFITS = [
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Every score, formula, and calculation is explained clearly. No black boxes.",
    color: "text-teal-600 bg-teal-50",
  },
  {
    icon: BarChart3,
    title: "Side-by-Side Comparison",
    description:
      "Compare up to 3 loan offers at once. Sort by EMI, rate, or total cost.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: Zap,
    title: "Instant Readiness Check",
    description:
      "Know your application weaknesses before the bank does. Get actionable tips.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: TrendingUp,
    title: "What-If Scenarios",
    description:
      "Simulate different loan amounts, tenures, and down payments side by side.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "We never collect banking passwords, OTPs, or card PINs. Data stays with you.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Lock,
    title: "Consent-Based Saving",
    description:
      "Your assessment data is only saved when you explicitly consent. Delete anytime.",
    color: "text-rose-600 bg-rose-50",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white" aria-label="Platform Benefits">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <RefreshCw className="w-4 h-4" />
              Why Choose LoanLens
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 mb-4">
              Your Loan Decision Deserves Better Tools
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Most people walk into a bank without knowing their borrowing capacity,
              credit health, or whether they&apos;re getting a fair deal. LoanLens changes
              that — with clarity, honesty, and privacy at its core.
            </p>

            {/* Stat */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { value: "₹0", label: "Cost to Use" },
                { value: "100%", label: "Transparent" },
                { value: "0", label: "Credentials Asked" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display text-3xl font-bold text-teal-600">{value}</div>
                  <div className="text-sm text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-card transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-navy-950 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
