import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoanComparison } from "@/components/compare/LoanComparison";

export const metadata: Metadata = {
  title: "Compare Loans",
  description:
    "Compare personal, home, education, vehicle, and business loans from multiple demo lenders side by side.",
};

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
          <LoanComparison />
        </div>
      </main>
      <Footer />
    </div>
  );
}
