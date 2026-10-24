import { calculateReadiness, type ReadinessInput } from "@/lib/readiness";

describe("LoanLens Readiness Engine — Rule-Based Underwriting Predictor", () => {
  const baseInput: ReadinessInput = {
    monthlyNetIncome: 100000,
    employmentType: "SALARIED",
    employmentDurationMonths: 36,
    existingEmiTotal: 10000,
    requestedLoanAmount: 1500000,
    desiredTenureMonths: 60,
    estimatedCreditScore: 780,
    monthlyExpenses: 30000,
    indicativeRate: 10.5,
  };

  test("calculates debt-to-income and projected ratios correctly", () => {
    const result = calculateReadiness(baseInput);

    // Existing DTI: 10,000 / 100,000 = 10%
    expect(result.debtToIncomeRatio).toBe(10);

    // New EMI exists and total DTI is greater than existing DTI
    expect(result.estimatedNewEmi).toBeGreaterThan(0);
    expect(result.totalEmiToIncome).toBeGreaterThan(result.debtToIncomeRatio);

    // High credit score + low DTI + long employment should yield strong score
    expect(result.readinessScore).toBeGreaterThanOrEqual(75);
    expect(["STRONG", "GOOD"]).toContain(result.scoreLabel);
  });

  test("flags high aggregate debt-to-income (> 50%) as a critical weakness", () => {
    const highDebtInput: ReadinessInput = {
      ...baseInput,
      monthlyNetIncome: 50000,
      existingEmiTotal: 25000, // already 50% DTI
      requestedLoanAmount: 2000000, // will push total DTI to over 80%
    };

    const result = calculateReadiness(highDebtInput);

    expect(result.totalEmiToIncome).toBeGreaterThan(50);
    expect(result.readinessScore).toBeLessThan(60);

    // Must identify weakness in output
    const hasDtiWeakness = result.weaknesses.some(
      (w) => w.description.toLowerCase().includes("debt") || w.description.toLowerCase().includes("income") || w.description.toLowerCase().includes("dti") || w.description.toLowerCase().includes("threshold")
    );
    expect(hasDtiWeakness).toBe(true);

    // Must provide actionable suggestions
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test("bounds readiness score strictly within 0 to 100", () => {
    // Extreme adverse case: high requested loan, low income, low credit score
    const worstCase: ReadinessInput = {
      monthlyNetIncome: 15000,
      employmentType: "OTHER",
      employmentDurationMonths: 2,
      existingEmiTotal: 12000,
      requestedLoanAmount: 5000000,
      desiredTenureMonths: 12,
      estimatedCreditScore: 500,
      monthlyExpenses: 15000,
    };

    const result = calculateReadiness(worstCase);
    expect(result.readinessScore).toBeGreaterThanOrEqual(0);
    expect(result.readinessScore).toBeLessThanOrEqual(100);
    expect(result.disposableIncome).toBeLessThanOrEqual(0);

    // Extreme positive case: high income, zero existing debt, high credit score
    const bestCase: ReadinessInput = {
      monthlyNetIncome: 500000,
      employmentType: "SALARIED",
      employmentDurationMonths: 120,
      existingEmiTotal: 0,
      requestedLoanAmount: 500000,
      desiredTenureMonths: 60,
      estimatedCreditScore: 850,
      monthlyExpenses: 50000,
    };

    const bestResult = calculateReadiness(bestCase);
    expect(bestResult.readinessScore).toBeGreaterThanOrEqual(80);
    expect(bestResult.readinessScore).toBeLessThanOrEqual(100);
  });

  test("ensures statutory educational disclaimer is always present", () => {
    const result = calculateReadiness(baseInput);
    expect(result.disclaimer).toBeTruthy();
    expect(result.disclaimer.toLowerCase()).toContain("educational");
  });
});
