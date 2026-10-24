import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    emoji: "💳",
    type: "PERSONAL",
    title: "Personal Loans",
    description:
      "Flexible funds for any purpose — wedding, travel, medical emergency, or home renovation.",
    rateRange: "10–24% p.a.",
    amountRange: "₹10K – ₹50L",
    tenure: "Up to 5 years",
    gradient: "from-violet-500 to-violet-700",
  },
  {
    emoji: "🏠",
    type: "HOME",
    title: "Home Loans",
    description:
      "Affordable housing finance with long tenures for purchasing, constructing, or renovating.",
    rateRange: "8.4–10.5% p.a.",
    amountRange: "₹2L – ₹7.5Cr",
    tenure: "Up to 30 years",
    gradient: "from-teal-500 to-teal-700",
  },
  {
    emoji: "🎓",
    type: "EDUCATION",
    title: "Education Loans",
    description:
      "Fund studies in India or abroad. Moratorium during the course period.",
    rateRange: "9–13% p.a.",
    amountRange: "₹50K – ₹50L",
    tenure: "Up to 10 years",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    emoji: "🚗",
    type: "VEHICLE",
    title: "Vehicle Loans",
    description:
      "Finance your dream car or two-wheeler with competitive rates and quick disbursement.",
    rateRange: "8.7–13.5% p.a.",
    amountRange: "₹20K – ₹50L",
    tenure: "Up to 7 years",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    emoji: "💼",
    type: "BUSINESS",
    title: "Business Loans",
    description:
      "Fuel MSME growth with working capital, equipment, or expansion financing.",
    rateRange: "11.5–18% p.a.",
    amountRange: "₹1L – ₹1Cr",
    tenure: "Up to 5 years",
    gradient: "from-green-500 to-green-700",
  },
];

export function LoanCategories() {
  return (
    <section className="py-20 bg-slate-50" aria-label="Loan Categories">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
            Loan Categories
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Compare indicative rates across all major loan types. Rate ranges are
            illustrative demo data only.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ emoji, type, title, description, rateRange, amountRange, tenure, gradient }) => (
            <div
              key={type}
              className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group card-hover"
            >
              <div className={`h-2 bg-gradient-to-r ${gradient}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-md`}>
                    {emoji}
                  </div>
                  <span className="badge-mock">Demo Rates</span>
                </div>

                <h3 className="font-display font-bold text-lg text-navy-950 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {description}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Rate", value: rateRange },
                    { label: "Amount", value: amountRange },
                    { label: "Tenure", value: tenure },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <div className="text-xs font-bold text-navy-900 truncate">{value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/compare?type=${type}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-teal-500 text-teal-700 font-semibold text-sm hover:bg-teal-500 hover:text-white transition-all duration-200 group"
                >
                  Compare {title}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
