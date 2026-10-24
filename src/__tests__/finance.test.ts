import { calculateEMI, calculateEMIFull, formatINR } from "@/lib/finance";

describe("LoanLens Finance Engine — EMI Calculations", () => {
  test("calculates standard reducing-balance EMI correctly for a home loan", () => {
    // 50 Lakhs, 8.5% p.a., 20 years (240 months)
    const principal = 5000000;
    const rate = 8.5;
    const tenure = 240;
    const emi = calculateEMI(principal, rate, tenure);

    // Expected standard banking reducing balance EMI ~ 43,391
    expect(emi).toBeGreaterThan(43000);
    expect(emi).toBeLessThan(44000);
    expect(Math.round(emi)).toBe(43391);
  });

  test("calculates standard EMI for a personal loan", () => {
    // 5 Lakhs, 12% p.a., 3 years (36 months)
    const principal = 500000;
    const rate = 12;
    const tenure = 36;
    const emi = calculateEMI(principal, rate, tenure);

    // Standard formula: ~ 16,607
    expect(Math.round(emi)).toBe(16607);
  });

  test("handles zero percent interest rate (0% promotional scheme)", () => {
    // 1.2 Lakhs, 0% rate, 12 months -> exactly 10,000/mo
    const emi = calculateEMI(120000, 0, 12);
    expect(emi).toBe(10000);
  });

  test("handles negative or invalid tenure safely", () => {
    expect(calculateEMI(500000, 10, 0)).toBe(0);
    expect(calculateEMI(500000, 10, -12)).toBe(0);
  });

  test("computes full breakdown with amortization schedule and processing fees", () => {
    const principal = 1000000;
    const rate = 10;
    const tenure = 12; // 1 year
    const processingFeePercent = 1.0;

    const full = calculateEMIFull(principal, rate, tenure, processingFeePercent);

    expect(full.principal).toBe(principal);
    expect(full.upfrontFee).toBe(10000); // 1% of 10 Lakhs = 10,000
    expect(full.amortizationSchedule.length).toBe(12);

    // Total repayments should equal monthlyEMI * tenure
    expect(full.totalRepayment).toBeCloseTo(full.monthlyEMI * 12, 1);
    expect(full.totalInterest).toBeCloseTo(full.totalRepayment - principal, 1);

    // Amortization final balance should reach 0
    const lastRow = full.amortizationSchedule[full.amortizationSchedule.length - 1];
    expect(lastRow.balance).toBeLessThanOrEqual(1); // rounding margin
  });

  test("formats INR currency according to Indian number grouping system", () => {
    expect(formatINR(1000)).toContain("1,000");
    expect(formatINR(100000)).toContain("1,00,000"); // 1 Lakh
    expect(formatINR(10000000)).toContain("1,00,00,000"); // 1 Crore
  });
});
