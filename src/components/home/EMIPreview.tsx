"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { calculateEMI, formatINR } from "@/lib/finance";

export function EMIPreview() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(60);

  const emi = calculateEMI(amount, rate, months);
  const total = emi * months;
  const interest = total - amount;
  const principalPct = Math.round((amount / total) * 100);

  return (
    <section className="py-20 bg-slate-50" aria-label="EMI Calculator Preview">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            Try It Instantly — No Sign-Up Needed
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
            EMI Calculator Preview
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Move the sliders to instantly see your estimated monthly payment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Sliders */}
            <div className="p-8 space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Loan Amount
                  </label>
                  <span className="text-sm font-bold text-teal-600">
                    {formatINR(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={10000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full"
                  aria-label="Loan amount slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹50K</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Interest Rate (Annual)
                  </label>
                  <span className="text-sm font-bold text-teal-600">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={24}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full"
                  aria-label="Interest rate slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5%</span>
                  <span>24%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tenure
                  </label>
                  <span className="text-sm font-bold text-teal-600">
                    {months} months ({Math.round(months / 12 * 10) / 10} yrs)
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={360}
                  step={6}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full"
                  aria-label="Tenure slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>6M</span>
                  <span>30Y</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 p-8 text-white">
              <div className="mb-6">
                <p className="text-white/60 text-sm mb-1">Monthly EMI</p>
                <p className="font-display text-5xl font-bold text-teal-400">
                  {formatINR(emi)}
                </p>
                <p className="text-white/40 text-xs mt-1">Per month for {months} months</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Principal Amount</span>
                  <span className="font-semibold">{formatINR(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Interest</span>
                  <span className="font-semibold text-amber-400">{formatINR(interest)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/10 pt-4">
                  <span className="text-white/80 font-medium">Total Repayment</span>
                  <span className="font-bold text-lg">{formatINR(total)}</span>
                </div>
              </div>

              {/* Mini chart */}
              <div className="space-y-2">
                <div className="h-3 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${principalPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-white/60">Principal {principalPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="text-white/60">Interest {100 - principalPct}%</span>
                  </div>
                </div>
              </div>

              <Link
                href="/calculator"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-colors"
              >
                Full Calculator with Amortization
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          * Indicative calculation only. Actual EMI may vary based on lender terms.
        </p>
      </div>
    </section>
  );
}
