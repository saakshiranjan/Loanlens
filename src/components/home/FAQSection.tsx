"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is LoanLens a bank or licensed lender?",
    a: "No. LoanLens is an educational and comparison platform only. We help you understand your options and compare indicative offers. You must apply directly with the lender of your choice. We are not a bank, NBFC, or licensed financial intermediary.",
  },
  {
    q: "Are the interest rates shown real and current?",
    a: "No — all rates, lender names, and loan products shown on LoanLens are demo/fictional data for illustration purposes. They are clearly labelled as 'Demo'. Real bank rates change frequently. Always verify current rates directly with the lender.",
  },
  {
    q: "Does my Readiness Score affect my actual CIBIL score?",
    a: "Absolutely not. Your LoanLens Readiness Score is a private, educational estimate calculated on your device or our servers. It is not reported to any credit bureau and has no impact on your actual CIBIL, Experian, or CRIF score.",
  },
  {
    q: "Do you store my financial information?",
    a: "Only if you create an account and explicitly consent. Calculations without login are not stored. Readiness assessments are only saved when you check the consent box. You can delete all your data at any time from your dashboard.",
  },
  {
    q: "Does LoanLens collect my banking login, OTP, or card PIN?",
    a: "Never. We do not connect to your bank account, ask for internet banking credentials, OTPs, or card PINs. If any site claiming to be LoanLens asks for these, it is fraudulent.",
  },
  {
    q: "How is the EMI calculated?",
    a: "We use the standard reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = principal, r = monthly interest rate, n = tenure in months. For zero-interest loans, EMI = P/n.",
  },
  {
    q: "Is it free to use?",
    a: "Yes — the EMI calculator, loan comparison, and readiness check are all free to use without creating an account. Saving results and accessing your personal dashboard requires a free account.",
  },
  {
    q: "How do I switch to production-mode with real Clerk authentication?",
    a: "Set NEXT_PUBLIC_USE_MOCK_AUTH=false in your .env.local and add your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY. The codebase supports both modes — see README.md for full setup instructions.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white" aria-label="Frequently Asked Questions">
      <div className="container-max section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  open === i
                    ? "border-teal-300 bg-teal-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-teal-200"
                )}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 p-5 text-left"
                  aria-expanded={open === i}
                  id={`faq-btn-${i}`}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-semibold text-navy-950 text-sm leading-relaxed">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-teal-500 flex-shrink-0 transition-transform duration-300",
                      open === i && "rotate-180"
                    )}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
