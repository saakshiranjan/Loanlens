/**
 * Loan Readiness Scoring Engine
 * 
 * IMPORTANT DISCLAIMER: This is an EDUCATIONAL tool only.
 * Scores produced are estimates based on transparent, configurable rules.
 * This is NOT an official credit score, not a lending decision,
 * and does NOT predict actual bank approval or rejection.
 * Always consult a qualified financial advisor.
 */

import { calculateEMI } from "./finance";

// ─── Scoring Weights (configurable) ─────────────────────────────────────────
export const SCORING_WEIGHTS = {
  DEBT_TO_INCOME: 25,       // DTI ratio (existing debts)
  NEW_EMI_RATIO: 30,        // new EMI as % of income
  CREDIT_SCORE: 20,         // credit score range
  EMPLOYMENT_STABILITY: 15, // duration and type
  DISPOSABLE_INCOME: 10,    // remaining income after all EMIs
} as const;

export interface ReadinessInput {
  monthlyNetIncome: number;
  employmentType: "SALARIED" | "SELF_EMPLOYED" | "OTHER";
  employmentDurationMonths: number;
  existingEmiTotal: number;
  requestedLoanAmount: number;
  desiredTenureMonths: number;
  estimatedCreditScore?: number;
  monthlyExpenses?: number;
  loanType?: string;
  // Indicative rate used for EMI estimation
  indicativeRate?: number;
}

export interface Weakness {
  factor: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
}

export interface Suggestion {
  title: string;
  description: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

export interface ReadinessResult {
  // Computed metrics
  debtToIncomeRatio: number;          // existing EMI / income
  estimatedNewEmi: number;
  totalEmiToIncome: number;           // (existing + new EMI) / income
  disposableIncome: number;           // income - expenses - all EMIs
  readinessScore: number;             // 0-100
  // Qualitative output
  weaknesses: Weakness[];
  suggestions: Suggestion[];
  scoreLabel: string;                 // STRONG | GOOD | FAIR | WEAK | POOR
  scoreColor: string;                 // tailwind color class
  disclaimer: string;
}

// Default indicative rates by loan type (fictional, for estimation only)
const DEFAULT_RATES: Record<string, number> = {
  PERSONAL: 13.0,
  HOME: 9.0,
  EDUCATION: 10.0,
  VEHICLE: 10.0,
  BUSINESS: 14.0,
};

export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const {
    monthlyNetIncome,
    employmentType,
    employmentDurationMonths,
    existingEmiTotal,
    requestedLoanAmount,
    desiredTenureMonths,
    estimatedCreditScore,
    monthlyExpenses = 0,
    loanType = "PERSONAL",
    indicativeRate,
  } = input;

  const rate =
    indicativeRate ?? DEFAULT_RATES[loanType] ?? 13.0;

  // ── Core Metrics ───────────────────────────────────────────────────────────
  const estimatedNewEmi = calculateEMI(
    requestedLoanAmount,
    rate,
    desiredTenureMonths
  );
  const totalEmi = existingEmiTotal + estimatedNewEmi;
  const debtToIncomeRatio =
    monthlyNetIncome > 0 ? existingEmiTotal / monthlyNetIncome : 1;
  const totalEmiToIncome =
    monthlyNetIncome > 0 ? totalEmi / monthlyNetIncome : 1;
  const disposableIncome =
    monthlyNetIncome - totalEmi - monthlyExpenses;

  // ── Score Components ───────────────────────────────────────────────────────
  let score = 0;
  const weaknesses: Weakness[] = [];
  const suggestions: Suggestion[] = [];

  // 1. Debt-to-Income (25 pts)
  let dtiScore = 0;
  if (debtToIncomeRatio <= 0.1) dtiScore = 25;
  else if (debtToIncomeRatio <= 0.2) dtiScore = 22;
  else if (debtToIncomeRatio <= 0.3) dtiScore = 18;
  else if (debtToIncomeRatio <= 0.4) dtiScore = 12;
  else if (debtToIncomeRatio <= 0.5) dtiScore = 6;
  else dtiScore = 0;

  if (debtToIncomeRatio > 0.4) {
    weaknesses.push({
      factor: "High Existing Debt",
      severity: debtToIncomeRatio > 0.5 ? "HIGH" : "MEDIUM",
      description: `Your existing EMIs consume ${Math.round(debtToIncomeRatio * 100)}% of your income. Most lenders prefer below 40%.`,
    });
    suggestions.push({
      title: "Reduce Existing EMI Burden",
      description:
        "Pay off smaller loans first to reduce your total EMI obligations before applying for a new loan.",
      impact: "HIGH",
    });
  }
  score += dtiScore;

  // 2. New EMI ratio (30 pts)
  let newEmiScore = 0;
  if (totalEmiToIncome <= 0.3) newEmiScore = 30;
  else if (totalEmiToIncome <= 0.4) newEmiScore = 24;
  else if (totalEmiToIncome <= 0.5) newEmiScore = 16;
  else if (totalEmiToIncome <= 0.6) newEmiScore = 8;
  else newEmiScore = 0;

  if (totalEmiToIncome > 0.5) {
    weaknesses.push({
      factor: "EMI Affordability Risk",
      severity: totalEmiToIncome > 0.6 ? "HIGH" : "MEDIUM",
      description: `Combined EMIs would be ${Math.round(totalEmiToIncome * 100)}% of income. Lenders typically cap this at 50%.`,
    });
    suggestions.push({
      title: "Extend Loan Tenure",
      description:
        "Opting for a longer repayment tenure reduces the monthly EMI and improves your EMI-to-income ratio.",
      impact: "HIGH",
    });
    suggestions.push({
      title: "Request a Lower Loan Amount",
      description:
        "A smaller loan amount means a lower EMI, which increases your approval chances significantly.",
      impact: "HIGH",
    });
  }
  score += newEmiScore;

  // 3. Credit Score (20 pts)
  let creditScore = 10; // default if unknown
  if (estimatedCreditScore !== undefined && estimatedCreditScore !== null) {
    if (estimatedCreditScore >= 800) creditScore = 20;
    else if (estimatedCreditScore >= 750) creditScore = 17;
    else if (estimatedCreditScore >= 700) creditScore = 13;
    else if (estimatedCreditScore >= 650) creditScore = 8;
    else if (estimatedCreditScore >= 600) creditScore = 4;
    else creditScore = 0;

    if (estimatedCreditScore < 700) {
      weaknesses.push({
        factor: "Credit Score Below Preferred Range",
        severity: estimatedCreditScore < 650 ? "HIGH" : "MEDIUM",
        description: `A CIBIL score of ${estimatedCreditScore} is below the 700+ most lenders prefer for standard rates.`,
      });
      suggestions.push({
        title: "Improve Your Credit Score",
        description:
          "Pay all EMIs and credit card bills on time. Check your credit report for errors (free at CIBIL, Experian, etc.).",
        impact: "HIGH",
      });
    }
  } else {
    // Unknown credit score
    weaknesses.push({
      factor: "Credit Score Unknown",
      severity: "LOW",
      description:
        "You haven't entered a credit score. Lenders will check your CIBIL score during processing.",
    });
    suggestions.push({
      title: "Check Your Credit Score",
      description:
        "Get a free credit report from CIBIL, Experian, or CRIF. Knowing your score helps you negotiate better rates.",
      impact: "MEDIUM",
    });
  }
  score += creditScore;

  // 4. Employment Stability (15 pts)
  let employmentScore = 0;
  if (employmentType === "SALARIED") {
    if (employmentDurationMonths >= 36) employmentScore = 15;
    else if (employmentDurationMonths >= 24) employmentScore = 12;
    else if (employmentDurationMonths >= 12) employmentScore = 8;
    else employmentScore = 4;
  } else if (employmentType === "SELF_EMPLOYED") {
    if (employmentDurationMonths >= 36) employmentScore = 13;
    else if (employmentDurationMonths >= 24) employmentScore = 10;
    else if (employmentDurationMonths >= 12) employmentScore = 6;
    else employmentScore = 2;
  } else {
    employmentScore = 5;
  }

  if (employmentDurationMonths < 12) {
    weaknesses.push({
      factor: "Short Employment Duration",
      severity: "MEDIUM",
      description: `Less than 1 year of employment/business duration may concern lenders. Most prefer 1–2 years minimum.`,
    });
    suggestions.push({
      title: "Continue in Current Employment",
      description:
        "Lenders prefer at least 1–2 years of stable employment. Consider applying after 12 months in your current role.",
      impact: "MEDIUM",
    });
  }
  score += employmentScore;

  // 5. Disposable Income (10 pts)
  let disposableScore = 0;
  const disposableRatio = monthlyNetIncome > 0 ? disposableIncome / monthlyNetIncome : 0;
  if (disposableRatio >= 0.4) disposableScore = 10;
  else if (disposableRatio >= 0.25) disposableScore = 7;
  else if (disposableRatio >= 0.1) disposableScore = 4;
  else disposableScore = 0;

  if (disposableIncome < 5000) {
    weaknesses.push({
      factor: "Very Low Disposable Income",
      severity: disposableIncome < 0 ? "HIGH" : "MEDIUM",
      description: `After all EMIs${monthlyExpenses ? " and expenses" : ""}, your estimated disposable income is ₹${Math.round(disposableIncome).toLocaleString("en-IN")}. This may signal financial stress.`,
    });
    suggestions.push({
      title: "Increase Income or Reduce Expenses",
      description:
        "A secondary income source or reduced non-essential expenses can significantly improve your readiness.",
      impact: "MEDIUM",
    });
  }
  score += disposableScore;

  // Cap score at 0–100
  score = Math.min(100, Math.max(0, Math.round(score)));

  // ── Score Label ────────────────────────────────────────────────────────────
  let scoreLabel: string;
  let scoreColor: string;
  if (score >= 80) { scoreLabel = "STRONG"; scoreColor = "text-teal-500"; }
  else if (score >= 65) { scoreLabel = "GOOD"; scoreColor = "text-green-500"; }
  else if (score >= 50) { scoreLabel = "FAIR"; scoreColor = "text-yellow-500"; }
  else if (score >= 35) { scoreLabel = "WEAK"; scoreColor = "text-orange-500"; }
  else { scoreLabel = "POOR"; scoreColor = "text-red-500"; }

  // Add generic suggestion if no weaknesses
  if (weaknesses.length === 0) {
    suggestions.push({
      title: "Maintain Your Financial Health",
      description:
        "Your profile looks strong. Keep paying EMIs on time and avoid taking on additional debt before applying.",
      impact: "LOW",
    });
  }

  return {
    debtToIncomeRatio: Math.round(debtToIncomeRatio * 10000) / 100,
    estimatedNewEmi: Math.round(estimatedNewEmi * 100) / 100,
    totalEmiToIncome: Math.round(totalEmiToIncome * 10000) / 100,
    disposableIncome: Math.round(disposableIncome * 100) / 100,
    readinessScore: score,
    weaknesses,
    suggestions,
    scoreLabel,
    scoreColor,
    disclaimer:
      "⚠️ This is an educational readiness estimate only, not an official credit score or lending decision. Actual loan approval depends on many factors assessed by individual lenders. Please consult a qualified financial advisor.",
  };
}
