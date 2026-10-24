import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Sparkles,
  HelpCircle,
  Lock,
  Building,
  TrendingUp,
  FileCheck,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Business Model & Monetization Ethics | LoanLens",
  description:
    "Learn how LoanLens sustains its independent fintech platform through transparent free tiers, premium financial planning, and ethical referral disclosures.",
};

export default function BusinessModelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Transparency & Independence</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-navy-950 tracking-tight">
            How LoanLens Operates & Sustains Itself
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            We believe transparent financial tools require transparent business practices. Here is exactly how we earn revenue, protect your data, and preserve our algorithmic integrity.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1: Free Forever */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-teal-500 to-teal-600" />
            <CardHeader>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Pillar 01</span>
              <CardTitle className="text-xl mt-1">100% Free Core Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                Essential financial literacy and calculation tools must be accessible to every borrower across India without barriers or paywalls.
              </p>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Unlimited Reducing-Balance EMI Calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Monthly amortization schedule breakdowns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Basic side-by-side comparisons of up to 3 loans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Transparent formula explanations & no spam calls</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 2: Premium Advisory */}
          <Card className="border-teal-200 bg-gradient-to-b from-teal-50/40 to-white shadow-md relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-navy-800 to-teal-500" />
            <div className="absolute top-4 right-4 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Value Add
            </div>
            <CardHeader>
              <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">Pillar 02</span>
              <CardTitle className="text-xl mt-1">Advanced Financial Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                For power borrowers, real estate purchasers, and MSME founders seeking deeper scenario simulation and optimization.
              </p>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Multi-variable What-If loan simulators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Comprehensive Debt Snowball & pre-payment plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Detailed PDF audit reports for bank discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Priority access to new analytical modules</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 3: Referral Disclosures */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-navy-950 to-navy-800" />
            <CardHeader>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pillar 03</span>
              <CardTitle className="text-xl mt-1">Ethical Referral Partnerships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                When a user voluntarily chooses to apply with a lender through an outbound link, we may receive an origination referral commission.
              </p>
              <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Always labeled with prominent "Sponsored" badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Zero influence on algorithm ranking or math</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>No user contact information is ever pre-shared</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Outbound direct links to verified lender portals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Data Privacy & Non-Endorsement Guarantees */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 md:p-12 shadow-sm mb-16 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Our Non-Negotiable Privacy Guarantees
              </h2>
              <p className="text-sm text-slate-500">
                Strict guardrails built into the architecture of LoanLens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <XCircle className="w-4 h-4" />
                <span>Zero Data Selling</span>
              </div>
              <p className="text-slate-600 text-xs">
                We never monetize your name, phone number, salary, or financial calculations by selling lead lists to third-party call centers or credit bureaus.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <XCircle className="w-4 h-4" />
                <span>No Banking Passwords or OTPs</span>
              </div>
              <p className="text-slate-600 text-xs">
                LoanLens will NEVER ask you for net banking credentials, ATM PINs, card CVVs, or SMS OTPs. All analyses are strictly self-reported estimates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Right to Erasure</span>
              </div>
              <p className="text-slate-600 text-xs">
                Users can delete any saved calculation, readiness assessment, or comparison with a single click from their Dashboard at any time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Transparent Scoring Logic</span>
              </div>
              <p className="text-slate-600 text-xs">
                Every readiness score and DTI calculation reveals the exact underlying mathematical weights and rules without black-box bias.
              </p>
            </div>
          </div>

          {/* Legal Non-Endorsement Notice */}
          <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Statutory Disclaimer & Non-Endorsement Notice</h4>
            <p>
              LoanLens (loanlens.in) is an independent financial education and decision-support web application. LoanLens is NOT a bank, Non-Banking Financial Company (NBFC), or licensed credit institution under the Reserve Bank of India (RBI) Act. We do not issue loans, sanction credit, or make credit decisions.
            </p>
            <p>
              The names, trademarks, and logos of third-party banks and financial institutions (such as Bharat State Bank, IndiaFirst Finance Bank, etc.) shown on this website are for identification, reference, and comparison purposes only. Display of these marks does NOT imply any affiliation, sponsorship, endorsement, or recommendation by the respective banks unless explicitly specified.
            </p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="text-center bg-gradient-to-r from-navy-950 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Experience Transparent Loan Discovery Today
          </h2>
          <p className="text-teal-100 text-sm max-w-xl mx-auto">
            Calculate your true repayment figures and test your application readiness without fear of spam calls or unconsented credit pulls.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/readiness">
              <Button variant="primary" size="lg" className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold">
                Check My Readiness
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Compare Bank Offers
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
