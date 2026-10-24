"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { formatINR } from "@/lib/finance";
import {
  Calculator,
  GitCompare,
  Gauge,
  Sliders,
  Trash2,
  TrendingUp,
  User,
  Shield,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface CalculationItem {
  id: string;
  loanType: string;
  amount: number;
  annualRate: number;
  tenureMonths: number;
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
  createdAt: string;
}

interface AssessmentItem {
  id: string;
  monthlyNetIncome: number;
  existingEMIs: number;
  requestedAmount: number;
  desiredTenureMonths: number;
  dtiRatio: number;
  projectedDtiRatio: number;
  estimatedEMI: number;
  readinessScore: number;
  weaknesses: string[];
  suggestions: string[];
  createdAt: string;
}

interface ScenarioItem {
  id: string;
  name: string;
  loanAmount: number;
  annualRate: number;
  tenureMonths: number;
  downPayment: number;
  monthlyEMI: number;
  disposableIncome: number;
  createdAt: string;
}

interface ComparisonItem {
  id: string;
  name: string;
  loanType: string;
  createdAt: string;
  items: Array<{
    id: string;
    loanProduct: {
      productName: string;
      minInterestRate: number;
      lender: { name: string; shortName: string };
    };
  }>;
}

interface DashboardData {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    monthlyIncome?: number | null;
    employmentType?: string | null;
    creditScoreRange?: string | null;
    createdAt?: string;
  };
  calculations: CalculationItem[];
  assessments: AssessmentItem[];
  scenarios: ScenarioItem[];
  comparisons: ComparisonItem[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "calculations" | "assessments" | "scenarios" | "comparisons"
  >("overview");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toast({ type: "error", title: "Error", message: "Failed to load dashboard data." });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else {
        fetchDashboardData();
      }
    }
  }, [authLoading, isAuthenticated, router, fetchDashboardData]);

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this saved record?")) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/dashboard/delete?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ type: "success", title: "Record Deleted", message: "Item removed from your account." });
        fetchDashboardData();
      } else {
        toast({ type: "error", title: "Error", message: "Could not delete record." });
      }
    } catch {
      toast({ type: "error", title: "Network Error", message: "Please try again later." });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteAllAssessments = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently clear all financial readiness assessments? This action cannot be undone."
      )
    ) {
      return;
    }

    if (!data?.assessments || data.assessments.length === 0) return;

    for (const a of data.assessments) {
      await fetch(`/api/dashboard/delete?type=assessment&id=${a.id}`, { method: "DELETE" });
    }
    toast({ type: "success", title: "Assessments Cleared", message: "All readiness records have been deleted." });
    fetchDashboardData();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 text-sm">Loading your financial dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const latestAssessment = data?.assessments?.[0];
  const calculationsCount = data?.calculations?.length || 0;
  const comparisonsCount = data?.comparisons?.length || 0;
  const scenariosCount = data?.scenarios?.length || 0;
  const assessmentsCount = data?.assessments?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-teal-950 text-white p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden mb-8 border border-navy-800">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Loan Assistant Dashboard</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Welcome, {data?.user.name || user?.name || "Valued User"}
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                Track your active borrowing capacity, review calculated EMIs, and monitor your loan application readiness metrics.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/readiness">
                <Button variant="primary" size="md" className="gap-2 bg-teal-500 hover:bg-teal-400 text-navy-950 font-semibold shadow-lg shadow-teal-500/20">
                  <Gauge className="w-4 h-4" />
                  Check Readiness
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="secondary" size="md" className="gap-2 border-slate-600 text-white hover:bg-white/10">
                  <Calculator className="w-4 h-4" />
                  New EMI Calc
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400">Readiness Score</p>
              <p className="text-2xl font-bold font-display text-teal-400 mt-0.5">
                {latestAssessment ? `${latestAssessment.readinessScore}/100` : "Not checked"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Current DTI Ratio</p>
              <p className="text-2xl font-bold font-display text-white mt-0.5">
                {latestAssessment ? `${latestAssessment.dtiRatio.toFixed(1)}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Saved Scenarios</p>
              <p className="text-2xl font-bold font-display text-white mt-0.5">
                {scenariosCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Recent Calculations</p>
              <p className="text-2xl font-bold font-display text-white mt-0.5">
                {calculationsCount}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "calculations", label: `Calculations (${calculationsCount})`, icon: Calculator },
            { id: "assessments", label: `Readiness (${assessmentsCount})`, icon: Gauge },
            { id: "scenarios", label: `What-If Scenarios (${scenariosCount})`, icon: Sliders },
            { id: "comparisons", label: `Comparisons (${comparisonsCount})`, icon: GitCompare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-teal-600 text-teal-700 bg-teal-50/50"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow border-slate-200/80">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Loan Readiness</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Find out how lenders evaluate your income, existing debts, and requested tenure before applying.
                  </p>
                  <Link href="/readiness" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700">
                    Run readiness check <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border-slate-200/80">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Accurate EMI Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Calculate reducing balance EMIs, full amortization tables, interest breakdowns, and processing fees.
                  </p>
                  <Link href="/calculator" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Open calculator <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border-slate-200/80">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-2">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">What-If Simulator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Simulate how down payments, tenure changes, or rate fluctuations impact your monthly disposable income.
                  </p>
                  <Link href="/simulator" className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700">
                    Simulate scenarios <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Latest Readiness Assessment Highlight */}
            {latestAssessment ? (
              <Card className="border-teal-200 bg-gradient-to-br from-white via-teal-50/20 to-slate-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Latest Assessment</span>
                      <CardTitle className="text-xl mt-1">Application Readiness Analysis</CardTitle>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-teal-600 text-white font-bold font-display text-lg shadow-sm">
                      Score: {latestAssessment.readinessScore}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs text-slate-500">Monthly Net Income</span>
                      <p className="text-base font-semibold text-slate-900 mt-0.5">
                        {formatINR(latestAssessment.monthlyNetIncome)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Existing EMIs</span>
                      <p className="text-base font-semibold text-slate-900 mt-0.5">
                        {formatINR(latestAssessment.existingEMIs)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Requested Loan</span>
                      <p className="text-base font-semibold text-slate-900 mt-0.5">
                        {formatINR(latestAssessment.requestedAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Projected Total DTI</span>
                      <p className="text-base font-semibold text-teal-700 mt-0.5">
                        {latestAssessment.projectedDtiRatio.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {latestAssessment.weaknesses && latestAssessment.weaknesses.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Identified Friction Points
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                        {latestAssessment.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {latestAssessment.suggestions && latestAssessment.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        Actionable Suggestions
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                        {latestAssessment.suggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-teal-50/60 border border-teal-200/60 p-2.5 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="p-8 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <Gauge className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-display font-semibold text-slate-900 text-lg">No Readiness Check Run Yet</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Calculate your Debt-to-Income ratio and get personalized suggestions before talking to a bank.
                  </p>
                </div>
                <Link href="/readiness">
                  <Button variant="primary" size="md">
                    Check My Loan Readiness
                  </Button>
                </Link>
              </div>
            )}

            {/* Financial Education Recommendations */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">Personalized Financial Guides</h3>
                  <p className="text-xs text-slate-500">Expert banking knowledge to optimize your borrowing journey</p>
                </div>
                <Link href="/#articles" className="text-xs font-semibold text-teal-600 hover:underline">
                  View all guides
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Credit Score
                    </span>
                    <span className="text-xs text-slate-400">4 min read</span>
                  </div>
                  <h4 className="font-display font-semibold text-slate-900 text-base">
                    How a 50-Point CIBIL Jump Can Save ₹4 Lakhs on Home Loans
                  </h4>
                  <p className="text-xs text-slate-500">
                    Learn how Indian lenders price risk dynamically and how reducing credit card utilization can quickly raise your score.
                  </p>
                  <Link href="/readiness" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
                    Read guide <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Debt Capacity
                    </span>
                    <span className="text-xs text-slate-400">5 min read</span>
                  </div>
                  <h4 className="font-display font-semibold text-slate-900 text-base">
                    Understanding the 40% FOIR (Fixed Obligation to Income Ratio) Rule
                  </h4>
                  <p className="text-xs text-slate-500">
                    Why Indian banks cap aggregate EMIs at 40–50% of your net pay and the best strategies to clear small debts first.
                  </p>
                  <Link href="/calculator" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
                    Read guide <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                      Pre-Payment
                    </span>
                    <span className="text-xs text-slate-400">3 min read</span>
                  </div>
                  <h4 className="font-display font-semibold text-slate-900 text-base">
                    The 1 Extra EMI Formula: Cut Your Loan Tenure by 4 Years
                  </h4>
                  <p className="text-xs text-slate-500">
                    How making one extra principal prepayment every financial year dramatically crushes compound interest on long loans.
                  </p>
                  <Link href="/simulator" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
                    Read guide <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Calculations */}
        {activeTab === "calculations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Recent EMI Calculations</h2>
                <p className="text-xs text-slate-500">Calculated loans and interest amortization estimates</p>
              </div>
              <Link href="/calculator">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Calculator className="w-4 h-4" /> New Calculation
                </Button>
              </Link>
            </div>

            {calculationsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.calculations.map((calc) => (
                  <Card key={calc.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            {calc.loanType} LOAN
                          </span>
                          <h4 className="font-display text-xl font-bold text-slate-900 mt-2">
                            {formatINR(calc.amount)}
                          </h4>
                          <p className="text-xs text-slate-500">
                            at {calc.annualRate}% p.a. for {calc.tenureMonths} months ({Math.round(calc.tenureMonths / 12)} yrs)
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete("calculation", calc.id)}
                          disabled={isDeleting === calc.id}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500">Monthly EMI</span>
                          <p className="font-bold text-teal-700 text-sm mt-0.5">{formatINR(calc.monthlyEMI)}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Total Interest</span>
                          <p className="font-semibold text-slate-800 text-sm mt-0.5">{formatINR(calc.totalInterest)}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Total Payment</span>
                          <p className="font-semibold text-slate-800 text-sm mt-0.5">{formatINR(calc.totalRepayment)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
                <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-800">No Calculations Saved Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Use our EMI calculator to compute repayments, inspect amortization tables, and save calculations to your profile.
                </p>
                <Link href="/calculator">
                  <Button variant="primary" size="md">
                    Start Calculating
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Assessments */}
        {activeTab === "assessments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Readiness Assessments</h2>
                <p className="text-xs text-slate-500">Your historical debt-to-income and qualification evaluations</p>
              </div>
              <div className="flex items-center gap-3">
                {assessmentsCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAllAssessments}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear All Records
                  </Button>
                )}
                <Link href="/readiness">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <Gauge className="w-4 h-4" /> New Assessment
                  </Button>
                </Link>
              </div>
            </div>

            {assessmentsCount > 0 ? (
              <div className="space-y-4">
                {data?.assessments.map((a) => (
                  <Card key={a.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-display font-bold text-xl flex items-center justify-center">
                            {a.readinessScore}
                          </div>
                          <div>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                              Score: {a.readinessScore}/100
                            </span>
                            <h4 className="font-display text-lg font-bold text-slate-900 mt-1">
                              Loan Request: {formatINR(a.requestedAmount)}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Tenure: {a.desiredTenureMonths} months ({Math.round(a.desiredTenureMonths / 12)} yrs) | Net Pay: {formatINR(a.monthlyNetIncome)}/mo
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-xs text-slate-500">Projected DTI</span>
                            <p className="font-bold text-teal-700">{a.projectedDtiRatio.toFixed(1)}%</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500">Estimated EMI</span>
                            <p className="font-bold text-slate-800">{formatINR(a.estimatedEMI)}</p>
                          </div>
                          <button
                            onClick={() => handleDelete("assessment", a.id)}
                            disabled={isDeleting === a.id}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete assessment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {a.suggestions && a.suggestions.length > 0 && (
                        <div className="mt-4 pt-2">
                          <span className="text-xs font-semibold text-teal-800">Key Recommendations:</span>
                          <ul className="mt-1 text-xs text-slate-600 list-disc list-inside space-y-1">
                            {a.suggestions.slice(0, 3).map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
                <Gauge className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-800">No Saved Assessments</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Assess your readiness score and receive concrete feedback on how to increase approval odds.
                </p>
                <Link href="/readiness">
                  <Button variant="primary" size="md">
                    Take Assessment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Scenarios */}
        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Saved What-If Scenarios</h2>
                <p className="text-xs text-slate-500">Simulations comparing tenure, down payments, and rate adjustments</p>
              </div>
              <Link href="/simulator">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Sliders className="w-4 h-4" /> Open Simulator
                </Button>
              </Link>
            </div>

            {scenariosCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.scenarios.map((sc) => (
                  <Card key={sc.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-bold text-slate-900 text-lg">{sc.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Amount: {formatINR(sc.loanAmount)} • Down Payment: {formatINR(sc.downPayment)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete("scenario", sc.id)}
                          disabled={isDeleting === sc.id}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete scenario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500">Interest Rate</span>
                          <p className="font-semibold text-slate-800 text-sm mt-0.5">{sc.annualRate}%</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Monthly EMI</span>
                          <p className="font-bold text-teal-700 text-sm mt-0.5">{formatINR(sc.monthlyEMI)}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Leftover Disposable</span>
                          <p className="font-semibold text-slate-800 text-sm mt-0.5">{formatINR(sc.disposableIncome)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
                <Sliders className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-800">No Scenarios Saved</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Compare trade-offs between lower EMIs vs total interest paid over time in the What-If Simulator.
                </p>
                <Link href="/simulator">
                  <Button variant="primary" size="md">
                    Launch Simulator
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Comparisons */}
        {activeTab === "comparisons" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Saved Loan Comparisons</h2>
                <p className="text-xs text-slate-500">Side-by-side banking products evaluated</p>
              </div>
              <Link href="/compare">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <GitCompare className="w-4 h-4" /> Compare Offers
                </Button>
              </Link>
            </div>

            {comparisonsCount > 0 ? (
              <div className="space-y-4">
                {data?.comparisons.map((c) => (
                  <Card key={c.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {c.loanType}
                          </span>
                          <h4 className="font-display font-bold text-slate-900 text-lg mt-2">{c.name}</h4>
                          <p className="text-xs text-slate-500">
                            {c.items.length} lenders compared on {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete("comparison", c.id)}
                          disabled={isDeleting === c.id}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {c.items.map((item) => (
                          <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                            <span className="font-semibold text-slate-800">{item.loanProduct.lender.name}</span>
                            <p className="text-slate-500 mt-0.5">{item.loanProduct.productName}</p>
                            <p className="text-teal-700 font-bold mt-1">From {item.loanProduct.minInterestRate}% p.a.</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
                <GitCompare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-800">No Saved Comparisons</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select up to 3 bank loans side-by-side on our comparison engine to compare fees, rates, and eligibility.
                </p>
                <Link href="/compare">
                  <Button variant="primary" size="md">
                    Compare Banks
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Account Data Privacy & Deletion Notice */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-display font-semibold text-slate-900 text-sm">
                Your Privacy & Data Sovereignty
              </h4>
              <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
                LoanLens never sells your financial data. You maintain complete control over all calculation histories and readiness records, with full rights to delete assessments at any time.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/privacy">
              <Button variant="outline" size="sm" className="text-xs">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
