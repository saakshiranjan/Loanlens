/**
 * Core financial calculation utilities for LoanLens.
 * All formulas use the standard reducing-balance (flat EMI) method.
 */

/** Calculate monthly EMI using standard reducing-balance formula */
export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) {
    // Zero interest — equal principal instalments
    return principal / tenureMonths;
  }
  const r = annualRatePercent / 100 / 12; // monthly rate
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
}

export interface EMIResult {
  monthlyEMI: number;
  totalRepayment: number;
  totalInterest: number;
  upfrontFee: number;
  principal: number;
  interestPercent: number;
  principalPercent: number;
  amortizationSchedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateEMIFull(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
  processingFeePercent: number = 0
): EMIResult {
  const emi = calculateEMI(principal, annualRatePercent, tenureMonths);
  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - principal;
  const upfrontFee = Math.round((principal * processingFeePercent) / 100 * 100) / 100;

  const schedule: AmortizationRow[] = [];
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      month: i,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interestPart * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    monthlyEMI: Math.round(emi * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    upfrontFee,
    principal,
    interestPercent: Math.round((totalInterest / totalRepayment) * 10000) / 100,
    principalPercent:
      Math.round((principal / totalRepayment) * 10000) / 100,
    amortizationSchedule: schedule,
  };
}

/** Format currency in Indian Rupee style */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/** Format large numbers in Indian lakh/crore notation */
export function formatIndianShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
