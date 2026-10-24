"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { readinessSchema, type ReadinessInput } from "@/lib/validations";
import type { ReadinessResult, Weakness, Suggestion } from "@/lib/readiness";
import { formatINR } from "@/lib/finance";
import { LOAN_TYPES, EMPLOYMENT_TYPES, cn } from "@/lib/utils";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toaster";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

export function ReadinessCheck() {
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReadinessInput>({
    resolver: zodResolver(readinessSchema),
    defaultValues: {
      monthlyNetIncome: 0,
      employmentType: "SALARIED",
      employmentDurationMonths: 0,
      existingEmiTotal: 0,
      requestedLoanAmount: 0,
      desiredTenureMonths: 60,
      estimatedCreditScore: undefined,
      monthlyExpenses: 0,
      loanType: "PERSONAL",
      consentGiven: false,
    },
  });

  const consentGiven = watch("consentGiven");

  const onSubmit = async (data: ReadinessInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ type: "error", title: "Assessment failed", message: json.error });
        return;
      }
      setResult(json.result);
      setSavedId(json.savedId);
      if (json.savedId) {
        toast({ type: "success", title: "Assessment saved to your dashboard!" });
      }
    } catch {
      toast({ type: "error", title: "Network error", message: "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const scoreColor = result
    ? result.readinessScore >= 80 ? "#04c8b4"
    : result.readinessScore >= 65 ? "#22c55e"
    : result.readinessScore >= 50 ? "#f59e0b"
    : result.readinessScore >= 35 ? "#f97316"
    : "#ef4444"
    : "#e2e8f0";

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = result
    ? circumference - (result.readinessScore / 100) * circumference
    : circumference;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle>Your Financial Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Income */}
              <Input
                {...register("monthlyNetIncome", { valueAsNumber: true })}
                id="readiness-income"
                label="Monthly Net Income"
                type="number"
                leftAddon="₹"
                placeholder="75000"
                required
                error={errors.monthlyNetIncome?.message}
                hint="Take-home salary after all deductions"
              />

              {/* Employment */}
              <Select
                {...register("employmentType")}
                id="readiness-employment-type"
                label="Employment Type"
                required
                options={EMPLOYMENT_TYPES.map((e) => ({ value: e.value, label: e.label }))}
                error={errors.employmentType?.message}
              />

              <Input
                {...register("employmentDurationMonths", { valueAsNumber: true })}
                id="readiness-employment-duration"
                label="Employment / Business Duration (months)"
                type="number"
                placeholder="24"
                required
                error={errors.employmentDurationMonths?.message}
                hint="Months in current job or running current business"
              />

              {/* Existing EMIs */}
              <Input
                {...register("existingEmiTotal", { valueAsNumber: true })}
                id="readiness-existing-emi"
                label="Total Existing Monthly EMIs"
                type="number"
                leftAddon="₹"
                placeholder="0"
                required
                error={errors.existingEmiTotal?.message}
                hint="Sum of all current EMIs (home loan, car, credit card, etc.)"
              />

              {/* Optional expenses */}
              <Input
                {...register("monthlyExpenses", { valueAsNumber: true })}
                id="readiness-expenses"
                label="Monthly Essential Expenses (optional)"
                type="number"
                leftAddon="₹"
                placeholder="25000"
                error={errors.monthlyExpenses?.message}
                hint="Rent, food, utilities etc. — helps estimate disposable income"
              />

              {/* Requested loan */}
              <Input
                {...register("requestedLoanAmount", { valueAsNumber: true })}
                id="readiness-loan-amount"
                label="Requested Loan Amount"
                type="number"
                leftAddon="₹"
                placeholder="1000000"
                required
                error={errors.requestedLoanAmount?.message}
              />

              <Select
                {...register("loanType")}
                id="readiness-loan-type"
                label="Loan Type"
                options={LOAN_TYPES.map((l) => ({ value: l.value, label: `${l.icon} ${l.label}` }))}
                error={errors.loanType?.message}
              />

              <Input
                {...register("desiredTenureMonths", { valueAsNumber: true })}
                id="readiness-tenure"
                label="Desired Repayment Tenure (months)"
                type="number"
                placeholder="60"
                required
                error={errors.desiredTenureMonths?.message}
              />

              <Input
                {...register("estimatedCreditScore", { valueAsNumber: true, setValueAs: (v) => v === "" ? null : Number(v) })}
                id="readiness-credit-score"
                label="Estimated CIBIL Score (optional)"
                type="number"
                placeholder="750"
                error={errors.estimatedCreditScore?.message}
                hint="Leave blank if unknown. Range: 300–900."
              />

              {/* Consent */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("consentGiven")}
                    id="readiness-consent"
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      I consent to saving this assessment
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Your financial inputs will be saved to your LoanLens account
                      (if signed in) for future reference. You can delete this data
                      anytime from your dashboard. Checking this is required to save
                      results — uncheck to calculate without saving.
                    </div>
                  </div>
                </label>
                {errors.consentGiven && (
                  <p className="text-xs text-red-600 mt-2">⚠ {errors.consentGiven.message}</p>
                )}
              </div>

              <Button
                type="submit"
                id="readiness-submit-btn"
                isLoading={isLoading}
                className="w-full"
              >
                <Zap className="w-4 h-4" />
                Calculate My Readiness Score
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-6">
        {result ? (
          <>
            {/* Score card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* SVG Score Ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        cx="70" cy="70" r="54"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="70" cy="70" r="54"
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 70 70)"
                        className="score-ring transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-4xl font-bold" style={{ color: scoreColor }}>
                        {result.readinessScore}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="font-display text-2xl font-bold text-navy-950 mb-2">
                      {result.scoreLabel} Profile
                    </div>
                    <p className="text-slate-500 text-sm mb-4">{result.disclaimer}</p>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Existing DTI", value: `${result.debtToIncomeRatio}%`, alert: result.debtToIncomeRatio > 40 },
                        { label: "Est. New EMI", value: formatINR(result.estimatedNewEmi) },
                        { label: "Total EMI/Income", value: `${result.totalEmiToIncome}%`, alert: result.totalEmiToIncome > 50 },
                        { label: "Disposable Income", value: formatINR(result.disposableIncome), alert: result.disposableIncome < 5000 },
                      ].map(({ label, value, alert }) => (
                        <div key={label} className={cn("rounded-xl p-3", alert ? "bg-red-50" : "bg-slate-50")}>
                          <div className={cn("font-bold text-sm", alert ? "text-red-700" : "text-navy-800")}>
                            {value}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            {result.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <CardTitle>Potential Weaknesses</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.weaknesses.map((w: Weakness, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border",
                          w.severity === "HIGH"
                            ? "bg-red-50 border-red-200"
                            : w.severity === "MEDIUM"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-blue-50 border-blue-200"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full flex-shrink-0",
                            w.severity === "HIGH" ? "bg-red-200 text-red-800"
                            : w.severity === "MEDIUM" ? "bg-amber-200 text-amber-800"
                            : "bg-blue-200 text-blue-800"
                          )}
                        >
                          {w.severity}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{w.factor}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{w.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-teal-500" />
                  <CardTitle>Personalized Suggestions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.suggestions.map((s: Suggestion, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                      <ChevronRight className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-navy-950">{s.title}</p>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            s.impact === "HIGH" ? "bg-teal-200 text-teal-800"
                            : s.impact === "MEDIUM" ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                          )}>
                            {s.impact} impact
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scoring explanation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-slate-600" />
                <p className="font-semibold text-sm text-slate-700">How Your Score Was Calculated</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
                {[
                  { factor: "Debt-to-Income", weight: "25 pts" },
                  { factor: "EMI Affordability", weight: "30 pts" },
                  { factor: "Credit Score", weight: "20 pts" },
                  { factor: "Employment", weight: "15 pts" },
                  { factor: "Disposable Income", weight: "10 pts" },
                ].map(({ factor, weight }) => (
                  <div key={factor} className="bg-white rounded-xl p-3 border border-slate-200">
                    <div className="font-semibold text-navy-800 mb-1">{weight}</div>
                    <div className="text-slate-500">{factor}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-2">Ready to Check Your Readiness?</h3>
            <p className="text-sm text-slate-400 text-center max-w-sm px-4">
              Fill in your financial profile on the left to get a transparent
              educational readiness score with personalized improvement tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
