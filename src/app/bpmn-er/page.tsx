import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BankModelViewer } from "@/components/bpmn-er/BankModelViewer";

export const metadata: Metadata = {
  title: "ER & BPMN: Bank Database Model & Process | LoanLens",
  description:
    "Explore the interactive ER & BPMN models for banking database schemas and loan origination workflows with live token simulation and fullscreen mode.",
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
