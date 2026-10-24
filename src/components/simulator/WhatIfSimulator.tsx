"use client";

import { useState } from "react";
import { calculateEMIFull, formatINR } from "@/lib/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { Save, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Scenario {
  name: string;
  loanAmount: number;
  annualRate: number;
  tenureMonths: number;
  downPayment: number;
  existingEmis: number;
  monthlyIncome: number;
}

const defaultScenarios: Scenario[] = [
  {
    name: "Current Plan",
    loanAmount: 1500000,
    annualRate: 10.5,
    tenureMonths: 60,
    downPayment: 0,
    existingEmis: 15000,
    monthlyIncome: 80000,
  },
  {
    name: "Lower Amount",
    loanAmount: 1000000,
    annualRate: 10.5,
    tenureMonths: 60,
    downPayment: 500000,
    existingEmis: 15000,
    monthlyIncome: 80000,
  },
  {
    name: "Longer Tenure",
    loanAmount: 1500000,
    annualRate: 10.5,
    tenureMonths: 120,
    downPayment: 0,
    existingEmis: 15000,
    monthlyIncome: 80000,
  },
];

function computeScenario(s: Scenario) {
  const principal = Math.max(s.loanAmount - s.downPayment, 0);
  const result = calculateEMIFull(principal, s.annualRate, s.tenureMonths);
  const totalEmi = result.monthlyEMI + s.existingEmis;
  const disposable = s.monthlyIncome - totalEmi;
  const affordabilityPct = s.monthlyIncome > 0 ? (totalEmi / s.monthlyIncome) * 100 : 100;
  return { ...result, totalEmi, disposable, affordabilityPct };
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-teal-700">
          {format ? format(value) : `${prefix}${value.toLocaleString("en-IN")}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

const SCENARIO_COLORS = [
  { bg: "bg-teal-500", text: "text-teal-700", light: "bg-teal-50", border: "border-teal-200" },
  { bg: "bg-navy-700", text: "text-navy-700", light: "bg-navy-50", border: "border-navy-200" },
  { bg: "bg-violet-600", text: "text-violet-700", light: "bg-violet-50", border: "border-violet-200" },
];

export function WhatIfSimulator() {
  const { isAuthenticated } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
  const [isSaving, setIsSaving] = useState(false);

  const updateScenario = (idx: number, updates: Partial<Scenario>) => {
    setScenarios((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...updates } : s))
    );
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({ type: "info", title: "Sign in to save scenarios", message: "Create a free account to save your what-if scenarios." });
      return;
    }
    setIsSaving(true);
    try {
      await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "What-If Simulation " + new Date().toLocaleDateString("en-IN"),
          scenarioData: { scenarios },
        }),
      });
      toast({ type: "success", title: "Scenarios saved to dashboard!" });
    } catch {
      toast({ type: "error", title: "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const results = scenarios.map(computeScenario);

  const getAffordabilityColor = (pct: number) => {
    if (pct <= 30) return "text-teal-600";
    if (pct <= 40) return "text-green-600";
    if (pct <= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getAffordabilityLabel = (pct: number) => {
    if (pct <= 30) return "Comfortable";
    if (pct <= 40) return "Manageable";
    if (pct <= 50) return "Stretched";
    return "High Risk";
  };

  const radarData = [
    { metric: "Affordability", ...Object.fromEntries(scenarios.map((s, i) => [s.name, Math.max(0, 100 - results[i].affordabilityPct)])) },
    { metric: "Monthly EMI", ...Object.fromEntries(scenarios.map((s, i) => [s.name, 100 - Math.min(100, (results[i].monthlyEMI / 100000) * 100)])) },
    { metric: "Total Cost", ...Object.fromEntries(scenarios.map((s, i) => [s.name, 100 - Math.min(100, (results[i].totalRepayment / 5000000) * 100)])) },
    { metric: "Disposable", ...Object.fromEntries(scenarios.map((s, i) => [s.name, Math.min(100, Math.max(0, (results[i].disposable / s.monthlyIncome) * 100))])) },
  ];

  const RADAR_COLORS = ["#04c8b4", "#1e1f6e", "#7c3aed"];

  return (
    <div className="space-y-8">
      {/* Summary comparison row */}
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((s, idx) => {
          const r = results[idx];
          const color = SCENARIO_COLORS[idx];
          return (
            <Card key={idx} className={cn("border-2", color.border)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={cn("text-base", color.text)}>{s.name}</CardTitle>
                  <div className={cn("text-xs font-bold px-2 py-1 rounded-full", color.light, color.text)}>
                    {getAffordabilityLabel(r.affordabilityPct)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold text-navy-950 mb-1">
                  {formatINR(r.monthlyEMI)}
                </div>
                <div className="text-xs text-slate-500 mb-4">/month · EMI only</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Repayment</span>
                    <span className="font-semibold">{formatINR(r.totalRepayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Interest</span>
                    <span className="font-semibold text-amber-600">{formatINR(r.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">EMI/Income</span>
                    <span className={cn("font-semibold", getAffordabilityColor(r.affordabilityPct))}>
                      {r.affordabilityPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disposable</span>
                    <span className={cn("font-semibold", r.disposable < 10000 ? "text-red-600" : "text-teal-600")}>
                      {formatINR(r.disposable)}
                    </span>
                  </div>
                </div>

                {/* vs previous scenario */}
                {idx > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    <p className="text-xs text-slate-400 font-semibold mb-2">vs. Current Plan</p>
                    {[
                      { label: "Monthly EMI", delta: r.monthlyEMI - results[0].monthlyEMI },
                      { label: "Total Interest", delta: r.totalInterest - results[0].totalInterest },
                    ].map(({ label, delta }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{label}</span>
                        <span className={cn("font-semibold flex items-center gap-1", delta < 0 ? "text-teal-600" : delta > 0 ? "text-red-600" : "text-slate-400")}>
                          {delta < 0 ? <TrendingDown className="w-3 h-3" /> : delta > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          {delta !== 0 ? `${delta < 0 ? "-" : "+"}${formatINR(Math.abs(delta))}` : "Same"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Scenario sliders */}
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((s, idx) => {
          const color = SCENARIO_COLORS[idx];
          return (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", color.bg)} />
                  <CardTitle className="text-base">{s.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <RangeInput
                  label="Loan Amount"
                  value={s.loanAmount}
                  onChange={(v) => updateScenario(idx, { loanAmount: v })}
                  min={100000}
                  max={10000000}
                  step={100000}
                  format={formatINR}
                />
                <RangeInput
                  label="Interest Rate"
                  value={s.annualRate}
                  onChange={(v) => updateScenario(idx, { annualRate: v })}
                  min={5}
                  max={24}
                  step={0.5}
                  suffix="% p.a."
                />
                <RangeInput
                  label="Tenure"
                  value={s.tenureMonths}
                  onChange={(v) => updateScenario(idx, { tenureMonths: v })}
                  min={6}
                  max={360}
                  step={6}
                  suffix=" months"
                />
                <RangeInput
                  label="Down Payment"
                  value={s.downPayment}
                  onChange={(v) => updateScenario(idx, { downPayment: v })}
                  min={0}
                  max={s.loanAmount}
                  step={50000}
                  format={formatINR}
                />
                <RangeInput
                  label="Existing EMIs"
                  value={s.existingEmis}
                  onChange={(v) => updateScenario(idx, { existingEmis: v })}
                  min={0}
                  max={100000}
                  step={1000}
                  format={formatINR}
                />
                <RangeInput
                  label="Monthly Income"
                  value={s.monthlyIncome}
                  onChange={(v) => updateScenario(idx, { monthlyIncome: v })}
                  min={10000}
                  max={1000000}
                  step={5000}
                  format={formatINR}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Radar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Comparison Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                {scenarios.map((s, i) => (
                  <Radar
                    key={s.name}
                    name={s.name}
                    dataKey={s.name}
                    stroke={RADAR_COLORS[i]}
                    fill={RADAR_COLORS[i]}
                    fillOpacity={0.15}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {scenarios.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-3 h-3 rounded-full" style={{ background: RADAR_COLORS[i] }} />
                {s.name}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            Higher values on all axes = better outcome. Radar shows normalized scores.
          </p>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          id="simulator-save-btn"
          leftIcon={<Save className="w-4 h-4" />}
          size="lg"
        >
          Save These Scenarios
        </Button>
      </div>
    </div>
  );
}
