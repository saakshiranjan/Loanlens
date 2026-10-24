import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoanComparison } from "@/components/compare/LoanComparison";

export const metadata: Metadata = {
  title: "Compare Loans",
  description:
    "Compare personal, home, education, vehicle, and business loans from multiple demo lenders side by side.",
};

function ComparisonLoadingFallback() {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 text-sm">Loading loan comparison engine...</p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50 py-10">
        <div className="container-max section-padding">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-navy-950">
              Compare Loans
            </h1>
            <p className="text-slate-500 mt-2">
              Browse demo lender offers side-by-side. All data is fictional and
              for illustration only.
            </p>
          </div>
          <Suspense fallback={<ComparisonLoadingFallback />}>
            <LoanComparison />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
