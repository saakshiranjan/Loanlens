import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Scale, ArrowLeft, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | LoanLens",
  description:
    "LoanLens Terms of Service — Terms governing the use of our loan calculation algorithms, educational assessments, and comparison engines.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>User Agreement</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026 • Applies to all users of LoanLens
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong>Important Notice:</strong> LoanLens is an educational and analytical tool. We do not provide credit sanctions, underwriting warranties, or legal advice.
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using LoanLens (the “Service”), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">2. Scope of Services</h2>
              <p>
                LoanLens offers mathematical loan calculation tools, indicative interest rate comparisons across Indian financial institutions, debt-to-income (DTI) ratio calculators, and application readiness simulations. The platform is designed solely to empower consumers with analytical insights prior to engaging with licensed financial lenders.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">3. Non-Lending & Non-Brokerage Status</h2>
              <p>
                LoanLens is NOT an RBI-regulated bank, housing finance company (HFC), Non-Banking Financial Company (NBFC), or licensed credit broker. We do not originate loans, accept loan collateral, issue disbursement orders, or charge loan application fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">4. User Account & Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree never to share banking passwords, OTPs, or confidential PINs on our platform. Any suspected unauthorized access should be reported to support@loanlens.in immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">5. Limitation of Liability</h2>
              <p>
                While we strive for high calculation accuracy according to standard reducing-balance formulas, LoanLens shall not be held liable for discrepancies between our estimates and official final loan sanction letters issued by individual lenders. Lenders evaluate multiple proprietary risk parameters beyond standard DTI formulas.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">6. Governing Law & Jurisdiction</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of the use of this service shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
