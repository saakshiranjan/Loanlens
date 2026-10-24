"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { emiCalculatorSchema, type EMICalculatorInput } from "@/lib/validations";
import { calculateEMIFull, formatINR } from "@/lib/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import {
  Calculator,
  Download,
  Info,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { LOAN_TYPES } from "@/lib/utils";

const COLORS = ["#04c8b4", "#f59e0b"];

type AmortizationRow = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export function EMICalculatorFull() {
  const [result, setResult] = useState<ReturnType<typeof calculateEMIFull> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [tenureMode, setTenureMode] = useState<"months" | "years">("months");
  const [showSchedule, setShowSchedule] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EMICalculatorInput>({
    resolver: zodResolver(emiCalculatorSchema),
    defaultValues: {
      loanAmount: 1000000,
      annualRate: 10.5,
      tenureMonths: 60,
      processingFeePercent: 1.0,
      loanType: "PERSONAL",
    },
  });

  const watchedAmount = watch("loanAmount");
  const watchedRate = watch("annualRate");
  const watchedTenure = watch("tenureMonths");

  const onSubmit = async (data: EMICalculatorInput) => {
    setIsCalculating(true);
    try {
      // Client-side calculation (also sends to server to save if logged in)
      const calcResult = calculateEMIFull(
        data.loanAmount,
        data.annualRate,
        data.tenureMonths,
        data.processingFeePercent
      );
      setResult(calcResult);

      // Attempt to save via API (non-blocking)
      fetch("/api/emi/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {}); // silent fail if not logged in

      toast({
        type: "success",
        title: "EMI Calculated",
        message: `Monthly EMI: ${formatINR(calcResult.monthlyEMI)}`,
      });
    } catch {
      toast({ type: "error", title: "Calculation failed", message: "Please check your inputs." });
    } finally {
      setIsCalculating(false);
    }
  };

  const pieData = result
    ? [
        { name: "Principal", value: result.principal },
        { name: "Total Interest", value: result.totalInterest },
      ]
    : [];

  // Build yearly summary for bar chart (group 12 months)
  const yearlyData = result
    ? Array.from(
        { length: Math.ceil(result.amortizationSchedule.length / 12) },
        (_, yi) => {
          const rows = result.amortizationSchedule.slice(yi * 12, yi * 12 + 12);
          return {
            year: `Yr ${yi + 1}`,
            principal: Math.round(rows.reduce((s, r) => s + r.principal, 0)),
            interest: Math.round(rows.reduce((s, r) => s + r.interest, 0)),
          };
        }
      )
    : [];

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Form — 2 cols */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <CardTitle>Loan Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="loanType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Loan Type"
                    id="calc-loan-type"
                    options={LOAN_TYPES.map((l) => ({
                      value: l.value,
                      label: `${l.icon} ${l.label}`,
                    }))}
                    error={errors.loanType?.message}
                  />
                )}
              />

              <Input
                {...register("loanAmount", { valueAsNumber: true })}
                id="calc-loan-amount"
                label="Loan Amount"
                type="number"
                leftAddon="₹"
                placeholder="1000000"
                error={errors.loanAmount?.message}
                hint="Between ₹1,000 and ₹10 Crore"
              />

              <Input
                {...register("annualRate", { valueAsNumber: true })}
                id="calc-annual-rate"
                label="Annual Interest Rate"
                type="number"
                step="0.1"
                rightAddon="% p.a."
                placeholder="10.5"
                error={errors.annualRate?.message}
                hint="Indicative rate. Verify with lender."
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Tenure <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setTenureMode("months")}
                      className={`px-3 py-1 font-medium transition-colors ${
                        tenureMode === "months"
                          ? "bg-teal-500 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Months
                    </button>
                    <button
                      type="button"
                      onClick={() => setTenureMode("years")}
                      className={`px-3 py-1 font-medium transition-colors ${
                        tenureMode === "years"
                          ? "bg-teal-500 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Years
                    </button>
                  </div>
                </div>
                <Input
                  {...register("tenureMonths", {
                    valueAsNumber: true,
                    setValueAs: (v) =>
                      tenureMode === "years" ? Number(v) * 12 : Number(v),
                  })}
                  id="calc-tenure"
                  type="number"
                  rightAddon={tenureMode}
                  placeholder={tenureMode === "years" ? "5" : "60"}
                  error={errors.tenureMonths?.message}
                />
              </div>

              <Input
                {...register("processingFeePercent", { valueAsNumber: true })}
                id="calc-processing-fee"
                label="Processing Fee (optional)"
                type="number"
                step="0.1"
                rightAddon="%"
                placeholder="1.0"
                error={errors.processingFeePercent?.message}
                hint="Typically 0.5–3% of loan amount"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  id="calc-submit-btn"
                  isLoading={isCalculating}
                  className="flex-1"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate EMI
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { reset(); setResult(null); }}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  className="px-4"
                  title="Reset form"
                />
              </div>
            </form>

            {/* Live preview */}
            {watchedAmount > 0 && watchedRate > 0 && watchedTenure > 0 && (
              <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                <p className="text-xs text-teal-600 font-medium mb-1">Live Estimate</p>
                <p className="font-display text-2xl font-bold text-teal-700">
                  {formatINR(
                    calculateEMIFull(watchedAmount, watchedRate, watchedTenure).monthlyEMI
                  )}
                  <span className="text-sm font-normal text-teal-500 ml-1">/month</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results — 3 cols */}
      <div className="lg:col-span-3 space-y-6">
        {result ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Monthly EMI", value: formatINR(result.monthlyEMI), color: "text-teal-600", bg: "bg-teal-50" },
                { label: "Total Interest", value: formatINR(result.totalInterest), color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Total Repayment", value: formatINR(result.totalRepayment), color: "text-navy-800", bg: "bg-navy-50" },
                { label: "Processing Fee", value: formatINR(result.upfrontFee), color: "text-violet-600", bg: "bg-violet-50" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
                  <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Principal vs Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {pieData.map((entry, i) => (
                      <div key={entry.name} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-slate-600">
                          {entry.name}: {formatINR(entry.value)} ({i === 0 ? result.principalPercent : result.interestPercent}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bar chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Yearly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={yearlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="principal" name="Principal" fill="#04c8b4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interest" name="Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Amortization schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Amortization Schedule</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSchedule(!showSchedule)}
                    leftIcon={<TrendingUp className="w-4 h-4" />}
                  >
                    {showSchedule ? "Hide" : "Show"} Schedule
                  </Button>
                </div>
              </CardHeader>
              {showSchedule && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {["Month", "EMI", "Principal", "Interest", "Balance"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-500">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationSchedule.slice(0, 24).map((row: AmortizationRow) => (
                          <tr key={row.month} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-600">{row.month}</td>
                            <td className="py-2 px-3 font-medium">{formatINR(row.emi)}</td>
                            <td className="py-2 px-3 text-teal-700">{formatINR(row.principal)}</td>
                            <td className="py-2 px-3 text-amber-700">{formatINR(row.interest)}</td>
                            <td className="py-2 px-3 text-slate-700">{formatINR(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.amortizationSchedule.length > 24 && (
                      <p className="text-xs text-slate-400 mt-3 text-center">
                        Showing first 24 months of {result.amortizationSchedule.length}
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Calculations use the standard reducing-balance EMI formula. Actual EMI may
                vary based on lender&apos;s terms, processing dates, and applicable taxes.
                Always verify with the lender before committing.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-2">
              Enter Details to Calculate
            </h3>
            <p className="text-sm text-slate-400 text-center max-w-xs">
              Fill in the loan details on the left and click &ldquo;Calculate EMI&rdquo; to see
              your monthly payment, charts, and amortization schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
