"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="hero-bg relative min-h-[92vh] flex items-center overflow-hidden"
      aria-label="Hero Section"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-navy-700/40 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-max section-padding w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-300 font-medium">
                🇮🇳 Built for Indian Borrowers
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight">
                See Your Loan{" "}
                <span className="gradient-text">Clearly.</span>
              </h1>
              <p className="mt-4 text-xl text-white/70 leading-relaxed max-w-xl">
                Compare loans from multiple banks, calculate EMIs instantly, and
                discover your borrowing readiness — all before walking into a
                bank.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/readiness"
                id="hero-readiness-cta"
                className="btn-primary text-base px-7 py-4 group"
              >
                <Zap className="w-5 h-5" />
                Check My Loan Readiness
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/compare"
                id="hero-compare-cta"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-teal-400 hover:bg-teal-400/10 transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                Compare Loans
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                "Free to use",
                "No login required for calculator",
                "Demo data clearly labelled",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stats Cards */}
          <div className="hidden lg:flex flex-col gap-4 items-end">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {[
                {
                  value: "5+",
                  label: "Loan Categories",
                  color: "from-teal-500 to-teal-700",
                },
                {
                  value: "14",
                  label: "Demo Lenders",
                  color: "from-navy-600 to-navy-800",
                },
                {
                  value: "0–100",
                  label: "Readiness Score",
                  color: "from-violet-600 to-violet-800",
                },
                {
                  value: "Free",
                  label: "EMI Calculator",
                  color: "from-teal-600 to-navy-700",
                },
              ].map(({ value, label, color }) => (
                <div key={label} className="glass rounded-2xl p-5 hover:scale-105 transition-transform duration-200">
                  <div
                    className={`text-3xl font-display font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}
                  >
                    {value}
                  </div>
                  <div className="text-white/60 text-sm">{label}</div>
                </div>
              ))}
            </div>

            {/* Floating EMI card */}
            <div className="glass rounded-2xl p-5 w-full max-w-md animate-float">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">
                  Sample EMI (₹10L, 10%, 60 months)
                </span>
                <span className="badge-mock">Demo</span>
              </div>
              <div className="text-3xl font-bold text-teal-400 font-display">
                ₹21,247
              </div>
              <div className="text-white/50 text-xs mt-1">
                Monthly EMI · Total Interest: ₹2,74,820
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300"
                  style={{ width: "62%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Principal 62%</span>
                <span>Interest 38%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
}
