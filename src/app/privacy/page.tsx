import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, EyeOff, UserCheck, Trash2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LoanLens",
  description:
    "LoanLens Privacy Policy — Learn how your financial inquiries, self-reported data, and rights to deletion are protected under Indian data protection standards.",
};

export default function PrivacyPolicyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant Standards</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
              LoanLens Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026 • Effective Date: October 24, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">1. Our Core Privacy Philosophy</h2>
              <p>
                At LoanLens (“we”, “our”, or “us”), we believe that financial clarity should never come at the expense of personal privacy. We built LoanLens with fundamental architectural constraints designed to prevent data abuse and unsolicited telemarketing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">2. What We Explicitly NEVER Collect</h2>
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-red-900 text-xs space-y-2">
                <p className="font-bold">Strictly Prohibited Data Elements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Internet banking passwords or profile passwords</li>
                  <li>Debit card / credit card CVVs or ATM PINs</li>
                  <li>One-Time Passwords (OTPs) sent by your bank or Aadhaar authority</li>
                  <li>Direct bank account login credentials or session tokens</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">3. Information We Collect</h2>
              <p>
                <strong>Account Information:</strong> When you register an account, we collect your name, email address, and a securely salted bcrypt hash of your chosen password.
              </p>
              <p>
                <strong>Self-Reported Calculation Inputs:</strong> When using the EMI Calculator or Loan Readiness Assessment, you provide estimated numerical values (such as monthly net income, existing EMIs, desired loan amount, and tenure). These figures are used solely to run mathematical formulas.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">4. Zero Sale of Financial Data</h2>
              <p>
                We do not sell, rent, lease, or trade user contact lists, salary figures, or credit profiles to third-party telemarketing firms, direct sales agents (DSAs), or data brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">5. Right to Erasure & Data Deletion</h2>
              <p>
                You maintain complete ownership over your financial records. From your authenticated <strong>Dashboard</strong>, you can delete any saved EMI calculation, loan comparison, or readiness assessment at any time. When deleted, records are immediately purged from our active datastores.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">6. Security Measures</h2>
              <p>
                All communications with LoanLens are encrypted using industry-standard Transport Layer Security (TLS 1.3). Application databases use restricted access controls and parameterized queries to mitigate SQL injection and cross-site scripting (XSS).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-lg text-slate-900">7. Contact the Grievance Officer</h2>
              <p>
                In accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and DPDP Act 2023, you may contact our Grievance Officer:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong>Grievance & Privacy Officer</strong><br />
                LoanLens India Technologies Private Limited<br />
                Email: privacy@loanlens.in<br />
                Address: Tech Corridor, Outer Ring Road, Bengaluru, Karnataka, 560103, India
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
