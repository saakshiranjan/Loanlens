import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReadinessCheck } from "@/components/readiness/ReadinessCheck";

export const metadata: Metadata = {
  title: "Loan Readiness Check",
  description:
    "Get an educational estimate of your loan application readiness. Discover your borrowing capacity and potential weaknesses before applying.",
};

export default function ReadinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50 py-10">
        <div className="container-max section-padding">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              ⚡ Educational Estimate Only — Not an Official Credit Assessment
            </div>
            <h1 className="font-display text-3xl font-bold text-navy-950">
              LoanLens Readiness Check
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Enter your financial profile to get a transparent, rule-based readiness
              score (0–100) with personalized suggestions. This is an educational tool
              only and does not predict actual bank decisions.
            </p>
          </div>
          <ReadinessCheck />
        </div>
      </main>
      <Footer />
    </div>
  );
}
