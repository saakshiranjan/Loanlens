import { BarChart3, Calculator, CheckCircle, TrendingUp, Zap, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    step: "01",
    icon: Calculator,
    title: "Calculate Your EMI",
    description:
      "Enter loan amount, rate, and tenure. Get instant monthly payment, total cost, and amortization breakdown.",
    color: "from-teal-500 to-teal-700",
  },
  {
    step: "02",
    icon: BarChart3,
    title: "Compare Lenders",
    description:
      "Browse multiple banks side-by-side. Filter by loan type, compare rates, fees, and eligibility.",
    color: "from-navy-600 to-navy-800",
  },
  {
    step: "03",
    icon: Zap,
    title: "Check Readiness",
    description:
      "Input your financial profile. Get an educational readiness score with personalized improvement tips.",
    color: "from-violet-600 to-violet-800",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Simulate Scenarios",
    description:
      "Try what-if scenarios — shorter tenure, higher down payment, or different amounts — and see the impact.",
    color: "from-amber-500 to-orange-600",
  },
  {
    step: "05",
    icon: CheckCircle,
    title: "Apply with Confidence",
    description:
      "Armed with knowledge, contact the lender directly. LoanLens never stores your banking credentials.",
    color: "from-green-500 to-green-700",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white" aria-label="How It Works">
      <div className="container-max section-padding">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
            How LoanLens Works
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Five simple steps to go from loan confusion to financial clarity.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-200 via-violet-200 to-amber-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {STEPS.map(({ step, icon: Icon, title, description, color }) => (
              <div key={step} className="relative flex flex-col items-center text-center group">
                {/* Step Icon */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {step.slice(-1)}
                  </div>
                </div>

                <h3 className="font-semibold text-navy-950 mt-4 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* ER & BPMN Feature Spotlight */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-6 sm:p-8 text-white border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
                <GitBranch className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
                  New Feature: ER & BPMN
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Understand What Happens Inside the Bank
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                  Explore our interactive <strong>ER & BPMN Simulator</strong>. See how customer KYC, branch assets, and loan accounts interact across underwriting swimlanes with live token tracking and fullscreen mode.
                </p>
              </div>
            </div>

            <Link
              href="/bpmn-er"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm transition-all shadow-md shrink-0 active:scale-95"
            >
              <span>Explore ER & BPMN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
