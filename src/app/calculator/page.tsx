import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EMICalculatorFull } from "@/components/calculator/EMICalculatorFull";

export const metadata: Metadata = {
  title: "EMI Calculator",
  description:
    "Calculate your monthly EMI, total interest, and full amortization schedule using the standard reducing-balance formula.",
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50 py-10">
        <div className="container-max section-padding">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-navy-950">
              EMI Calculator
            </h1>
            <p className="text-slate-500 mt-2">
              Calculate monthly EMI, total interest, and view your amortization
              schedule. No sign-up required.
            </p>
          </div>
          <EMICalculatorFull />
        </div>
      </main>
      <Footer />
    </div>
  );
}
