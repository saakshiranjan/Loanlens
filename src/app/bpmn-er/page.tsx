import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BankModelViewer } from "@/components/bpmn-er/BankModelViewer";

export const metadata: Metadata = {
  title: "Bank Architecture: BPMN & ER Models | LoanLens",
  description:
    "Explore the interactive Indian banking database ER schema and BPMN 2.0 loan origination workflow. Live process token simulations, 3NF relational tables, and PostgreSQL DDL.",
};

export default function BpmnErPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <BankModelViewer />
      </main>

      <Footer />
    </div>
  );
}
