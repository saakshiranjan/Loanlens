import Link from "next/link";
import { ArrowRight, BarChart3, Zap } from "lucide-react";

export function CTABanner() {
  return (
    <section
      className="py-20 bg-navy-950 relative overflow-hidden"
      aria-label="Call to Action"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-navy-700/60 blur-3xl" />
      </div>

      <div className="container-max section-padding text-center relative z-10">
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
          Ready to Make a{" "}
          <span className="gradient-text">Smarter Loan Decision?</span>
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
          Join thousands of Indians who compared loans, calculated EMIs, and
          understood their financial readiness — all for free, with full privacy.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/readiness"
            id="cta-readiness-btn"
            className="btn-primary text-base px-8 py-4 group"
          >
            <Zap className="w-5 h-5" />
            Check My Loan Readiness
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/compare"
            id="cta-compare-btn"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-teal-400 hover:bg-teal-400/10 transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            Compare Loans Now
          </Link>
        </div>

        <p className="mt-6 text-white/40 text-xs">
          Free forever · No credit card · Demo data only · Your privacy protected
        </p>
      </div>
    </section>
  );
}
