import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatIfSimulator } from "@/components/simulator/WhatIfSimulator";

export const metadata: Metadata = {
  title: "What-If Loan Simulator",
  description:
    "Simulate different loan scenarios side by side. Compare loan amounts, tenures, down payments, and interest rates instantly.",
};

export default function SimulatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50 py-10">
        <div className="container-max section-padding">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-navy-950">
              What-If Loan Simulator
            </h1>
            <p className="text-slate-500 mt-2">
              Explore different scenarios side by side — change amount, tenure, rate, or down payment and see the impact instantly.
            </p>
          </div>
          <WhatIfSimulator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
