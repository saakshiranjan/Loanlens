"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { calculateEMI, formatINR } from "@/lib/finance";
import { LOAN_TYPES } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Check,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

interface LoanProduct {
  id: string;
  productName: string;
  loanType: string;
  minInterestRate: number;
  maxInterestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeeType: string;
  processingFeeValue: number;
  eligibilitySummary: string;
  minCreditScore: number | null;
  minIncome: number | null;
  isMock: boolean;
  lender: { name: string; shortName: string; type: string; isMock: boolean };
}

type SortKey = "minInterestRate" | "emi" | "totalRepayment";

const SORT_OPTIONS = [
  { value: "minInterestRate" as SortKey, label: "Interest Rate (Low–High)" },
  { value: "emi" as SortKey, label: "Estimated EMI" },
  { value: "totalRepayment" as SortKey, label: "Total Repayment" },
];

export function LoanComparison() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "PERSONAL"
  );
  const [sortBy, setSortBy] = useState<SortKey>("minInterestRate");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000000);
  const [calcTenure, setCalcTenure] = useState(60);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/loans/products?loanType=${selectedType}&sortBy=${sortBy}`
      );
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast({ type: "error", title: "Failed to load products" });
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) {
        toast({ type: "warning", title: "Max 3 for comparison", message: "Remove one to add another." });
        return prev;
      }
      return [...prev, id];
    });
  };

  const getEMI = (p: LoanProduct) =>
    calculateEMI(calcAmount, p.minInterestRate, calcTenure);
  const getTotalRepayment = (p: LoanProduct) =>
    getEMI(p) * calcTenure;

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "minInterestRate") return a.minInterestRate - b.minInterestRate;
    if (sortBy === "emi") return getEMI(a) - getEMI(b);
    return getTotalRepayment(a) - getTotalRepayment(b);
  });

  const compareProducts = sortedProducts.filter((p) => compareIds.includes(p.id));

  const getLenderBadge = (type: string) => {
    const badges: Record<string, string> = {
      PUBLIC_BANK: "bg-blue-100 text-blue-800",
      PRIVATE_BANK: "bg-violet-100 text-violet-800",
      NBFC: "bg-amber-100 text-amber-800",
      COOPERATIVE: "bg-green-100 text-green-800",
    };
    const labels: Record<string, string> = {
      PUBLIC_BANK: "Public Bank",
      PRIVATE_BANK: "Private Bank",
      NBFC: "NBFC",
      COOPERATIVE: "Co-op",
    };
    return { cls: badges[type] || "bg-slate-100 text-slate-700", label: labels[type] || type };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Loan type filter */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              LOAN TYPE
            </label>
            <div className="flex flex-wrap gap-2">
              {LOAN_TYPES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => { setSelectedType(value); setCompareIds([]); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    selectedType === value
                      ? "bg-teal-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                  id={`filter-${value.toLowerCase()}`}
                >
                  {icon} {label.replace(" Loan", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation inputs */}
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                FOR AMOUNT
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <span className="px-3 py-2.5 bg-slate-50 text-slate-600 text-sm">₹</span>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-28 px-3 py-2.5 text-sm focus:outline-none"
                  placeholder="1000000"
                  id="compare-amount-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                TENURE (MONTHS)
              </label>
              <input
                type="number"
                value={calcTenure}
                onChange={(e) => setCalcTenure(Number(e.target.value))}
                className="w-24 px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                id="compare-tenure-input"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              SORT BY
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
              id="compare-sort-select"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {compareIds.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">
              {compareIds.length} selected
            </span>
            <Button
              size="sm"
              onClick={() => setShowCompare(!showCompare)}
              leftIcon={<BarChart3 className="w-4 h-4" />}
            >
              {showCompare ? "Hide" : "View"} Side-by-Side
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCompareIds([])}
              leftIcon={<X className="w-4 h-4" />}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Demo data disclaimer */}
      <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Demo Data Notice:</strong> All lender names, interest rates, and loan terms shown
          below are fictional, for demonstration purposes only. They do not represent actual offers
          from any real bank or financial institution. Always verify current rates directly with
          the respective lender before making any financial decision.
        </p>
      </div>

      {/* Side-by-side comparison */}
      {showCompare && compareProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Side-by-Side Comparison ({formatINR(calcAmount)}, {calcTenure} months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm text-slate-500">Feature</th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="text-left py-3 px-4">
                        <div className="font-semibold text-navy-900 text-sm">{p.lender.name}</div>
                        <div className="text-xs text-slate-500">{p.productName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { label: "Min Rate", fn: (p: LoanProduct) => `${p.minInterestRate}% p.a.` },
                    { label: "Estimated EMI", fn: (p: LoanProduct) => formatINR(getEMI(p)) },
                    { label: "Total Repayment", fn: (p: LoanProduct) => formatINR(getTotalRepayment(p)) },
                    { label: "Total Interest", fn: (p: LoanProduct) => formatINR(getTotalRepayment(p) - calcAmount) },
                    { label: "Processing Fee", fn: (p: LoanProduct) => p.processingFeeType === "FLAT" ? formatINR(p.processingFeeValue) : `${p.processingFeeValue}%` },
                    { label: "Max Amount", fn: (p: LoanProduct) => formatINR(p.maxAmount) },
                    { label: "Max Tenure", fn: (p: LoanProduct) => `${p.maxTenureMonths}M` },
                    { label: "Min Credit Score", fn: (p: LoanProduct) => p.minCreditScore ? `${p.minCreditScore}+` : "Not specified" },
                  ].map(({ label, fn }) => (
                    <tr key={label} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium text-slate-600">{label}</td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-sm font-semibold text-slate-900">
                          {fn(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product cards */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="shimmer h-4 w-32 rounded mb-3" />
              <div className="shimmer h-6 w-48 rounded mb-2" />
              <div className="shimmer h-4 w-full rounded mb-2" />
              <div className="shimmer h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
          <div className="text-5xl mb-4">🏦</div>
          <h3 className="font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-400 text-sm">Try a different loan type or check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const emi = getEMI(product);
            const totalRep = emi * calcTenure;
            const isSelected = compareIds.includes(product.id);
            const badge = getLenderBadge(product.lender.type);

            return (
              <div
                key={product.id}
                className={cn(
                  "bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group",
                  isSelected && "ring-2 ring-teal-500"
                )}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {product.isMock && <span className="badge-mock">Demo</span>}
                    </div>
                    <h3 className="font-display font-bold text-navy-950 text-sm">
                      {product.lender.name}
                    </h3>
                    <p className="text-xs text-slate-500">{product.productName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-teal-600">
                      {product.minInterestRate}%
                    </div>
                    <div className="text-xs text-slate-400">p.a. (from)</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* EMI highlight */}
                  <div className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-xl p-4 text-white">
                    <div className="text-xs text-white/60 mb-1">
                      Est. EMI for {formatINR(calcAmount)} × {calcTenure}M
                    </div>
                    <div className="font-display text-2xl font-bold text-teal-400">
                      {formatINR(emi)}
                      <span className="text-sm font-normal text-white/60 ml-1">/month</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Total: {formatINR(totalRep)} · Int: {formatINR(totalRep - calcAmount)}
                    </div>
                  </div>

                  {/* Key details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-400 mb-0.5">Amount Range</div>
                      <div className="font-semibold text-slate-800">
                        {formatINR(product.minAmount)} – {formatINR(product.maxAmount)}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-400 mb-0.5">Tenure</div>
                      <div className="font-semibold text-slate-800">
                        {product.minTenureMonths}–{product.maxTenureMonths}M
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-400 mb-0.5">Processing Fee</div>
                      <div className="font-semibold text-slate-800">
                        {product.processingFeeType === "FLAT"
                          ? formatINR(product.processingFeeValue)
                          : `${product.processingFeeValue}%`}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-400 mb-0.5">Rate Range</div>
                      <div className="font-semibold text-slate-800">
                        {product.minInterestRate}–{product.maxInterestRate}%
                      </div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="text-xs text-slate-500 leading-relaxed border-l-2 border-teal-200 pl-3">
                    <strong className="text-slate-700">Eligibility:</strong>{" "}
                    {product.eligibilitySummary}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                        isSelected
                          ? "border-teal-500 bg-teal-500 text-white"
                          : "border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"
                      )}
                      id={`compare-btn-${product.id}`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                      {isSelected ? "Added" : "Compare"}
                    </button>
                    <button
                      onClick={() => toast({ type: "info", title: "View Details", message: "Full lender details page coming soon!" })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-navy-950 text-white hover:bg-navy-900 transition-colors"
                    >
                      Check Eligibility
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
