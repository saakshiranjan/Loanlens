import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LoanLens database...");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@123", 12);
  await prisma.userProfile.upsert({
    where: { email: "admin@loanlens.in" },
    update: {},
    create: {
      email: "admin@loanlens.in",
      name: "LoanLens Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Demo user
  const demoHash = await bcrypt.hash("Demo@123", 12);
  await prisma.userProfile.upsert({
    where: { email: "demo@loanlens.in" },
    update: {},
    create: {
      email: "demo@loanlens.in",
      name: "Priya Sharma",
      passwordHash: demoHash,
      role: "USER",
      monthlyIncome: 75000,
      employmentType: "SALARIED",
      creditScoreRange: "GOOD",
    },
  });

  // ─── Lenders ───────────────────────────────────────────────────────────────
  // NOTE: All lender data below is FICTIONAL / DEMO DATA for demonstration
  // purposes only. Rates, amounts, and fees are indicative examples and do NOT
  // represent actual current offers from any real bank. Always verify with
  // the respective lender before making any financial decisions.

  const lenders = [
    {
      name: "Bharat State Bank",
      shortName: "BSB",
      type: "PUBLIC_BANK",
      website: "https://example.com",
      isMock: true,
    },
    {
      name: "IndiaFirst Finance Bank",
      shortName: "IFB",
      type: "PRIVATE_BANK",
      website: "https://example.com",
      isMock: true,
    },
    {
      name: "Navodaya Credit Bank",
      shortName: "NCB",
      type: "PRIVATE_BANK",
      website: "https://example.com",
      isMock: true,
    },
    {
      name: "Desh Unnati NBFC",
      shortName: "DUN",
      type: "NBFC",
      website: "https://example.com",
      isMock: true,
    },
    {
      name: "Praja Co-operative Bank",
      shortName: "PCB",
      type: "COOPERATIVE",
      website: "https://example.com",
      isMock: true,
    },
    {
      name: "Swarna Private Bank",
      shortName: "SPB",
      type: "PRIVATE_BANK",
      website: "https://example.com",
      isMock: true,
    },
  ];

  const createdLenders: Record<string, string> = {};
  for (const lender of lenders) {
    const created = await prisma.lender.upsert({
      where: { id: lender.shortName },
      update: { name: lender.name, type: lender.type },
      create: { id: lender.shortName, ...lender },
    });
    createdLenders[lender.shortName] = created.id;
  }

  // ─── Loan Products ─────────────────────────────────────────────────────────
  const products = [
    // ── Personal Loans ──────────────────────────────────────────────────────
    {
      lenderId: "BSB",
      loanType: "PERSONAL",
      productName: "BSB Quick Personal Loan",
      minInterestRate: 10.5,
      maxInterestRate: 14.0,
      minAmount: 50000,
      maxAmount: 2000000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 1.0,
      processingFeeMin: 500,
      processingFeeMax: 15000,
      eligibilitySummary:
        "Salaried/self-employed aged 21–60. Min income ₹20,000/month. Min 1 year employment.",
      minCreditScore: 700,
      minIncome: 20000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "IFB",
      loanType: "PERSONAL",
      productName: "IFB Instant Personal Loan",
      minInterestRate: 11.0,
      maxInterestRate: 16.5,
      minAmount: 25000,
      maxAmount: 1500000,
      minTenureMonths: 6,
      maxTenureMonths: 60,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 2.0,
      processingFeeMin: 999,
      processingFeeMax: 20000,
      eligibilitySummary:
        "Age 23–58. Min income ₹25,000/month. Min 2 years employment.",
      minCreditScore: 720,
      minIncome: 25000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "NCB",
      loanType: "PERSONAL",
      productName: "NCB FlexiLoan",
      minInterestRate: 12.0,
      maxInterestRate: 18.0,
      minAmount: 10000,
      maxAmount: 750000,
      minTenureMonths: 3,
      maxTenureMonths: 48,
      processingFeeType: "FLAT",
      processingFeeValue: 1500,
      processingFeeMin: null,
      processingFeeMax: null,
      eligibilitySummary:
        "Salaried employees. Min income ₹15,000/month. Flexible repayment options.",
      minCreditScore: 680,
      minIncome: 15000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "DUN",
      loanType: "PERSONAL",
      productName: "DUN Personal Finance",
      minInterestRate: 15.0,
      maxInterestRate: 24.0,
      minAmount: 10000,
      maxAmount: 500000,
      minTenureMonths: 6,
      maxTenureMonths: 36,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 3.0,
      processingFeeMin: 1000,
      processingFeeMax: 10000,
      eligibilitySummary:
        "Quick approval for salaried. Min income ₹12,000/month. No collateral needed.",
      minCreditScore: 650,
      minIncome: 12000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },

    // ── Home Loans ──────────────────────────────────────────────────────────
    {
      lenderId: "BSB",
      loanType: "HOME",
      productName: "BSB Home Dream Loan",
      minInterestRate: 8.4,
      maxInterestRate: 9.5,
      minAmount: 500000,
      maxAmount: 50000000,
      minTenureMonths: 60,
      maxTenureMonths: 300,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 0.5,
      processingFeeMin: 5000,
      processingFeeMax: 50000,
      eligibilitySummary:
        "Salaried/self-employed. Min income ₹40,000/month. Property as collateral. Max 80% LTV.",
      minCreditScore: 720,
      minIncome: 40000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "SPB",
      loanType: "HOME",
      productName: "Swarna Home Builder",
      minInterestRate: 8.7,
      maxInterestRate: 10.0,
      minAmount: 300000,
      maxAmount: 75000000,
      minTenureMonths: 60,
      maxTenureMonths: 360,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 0.35,
      processingFeeMin: 3500,
      processingFeeMax: 75000,
      eligibilitySummary:
        "Age 21–65. Min income ₹35,000/month. Indian resident. Property in approved locations.",
      minCreditScore: 700,
      minIncome: 35000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "NCB",
      loanType: "HOME",
      productName: "NCB Affordable Housing Loan",
      minInterestRate: 9.0,
      maxInterestRate: 10.5,
      minAmount: 200000,
      maxAmount: 20000000,
      minTenureMonths: 36,
      maxTenureMonths: 240,
      processingFeeType: "FLAT",
      processingFeeValue: 5000,
      eligibilitySummary:
        "Under PM Awas Yojana eligible applicants preferred. Min income ₹25,000/month.",
      minCreditScore: 680,
      minIncome: 25000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },

    // ── Education Loans ─────────────────────────────────────────────────────
    {
      lenderId: "BSB",
      loanType: "EDUCATION",
      productName: "BSB Vidya Loan",
      minInterestRate: 9.0,
      maxInterestRate: 11.5,
      minAmount: 50000,
      maxAmount: 2000000,
      minTenureMonths: 12,
      maxTenureMonths: 84,
      processingFeeType: "FLAT",
      processingFeeValue: 0,
      eligibilitySummary:
        "Indian students admitted to recognized institutions. Co-applicant (parent/guardian) required.",
      minCreditScore: null,
      minIncome: null,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "IFB",
      loanType: "EDUCATION",
      productName: "IFB Scholar Finance",
      minInterestRate: 10.0,
      maxInterestRate: 13.0,
      minAmount: 100000,
      maxAmount: 5000000,
      minTenureMonths: 12,
      maxTenureMonths: 120,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 0.5,
      processingFeeMin: 0,
      processingFeeMax: 25000,
      eligibilitySummary:
        "For studies in India and abroad. Premier institutions eligible for higher amounts.",
      minCreditScore: null,
      minIncome: null,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },

    // ── Vehicle Loans ───────────────────────────────────────────────────────
    {
      lenderId: "IFB",
      loanType: "VEHICLE",
      productName: "IFB Auto Loan",
      minInterestRate: 8.7,
      maxInterestRate: 11.5,
      minAmount: 100000,
      maxAmount: 5000000,
      minTenureMonths: 12,
      maxTenureMonths: 84,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 1.0,
      processingFeeMin: 500,
      processingFeeMax: 15000,
      eligibilitySummary:
        "Salaried/self-employed. Min income ₹20,000/month. Vehicle as collateral. Up to 90% ex-showroom.",
      minCreditScore: 700,
      minIncome: 20000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "SPB",
      loanType: "VEHICLE",
      productName: "Swarna Two-Wheeler Loan",
      minInterestRate: 9.5,
      maxInterestRate: 13.0,
      minAmount: 20000,
      maxAmount: 300000,
      minTenureMonths: 12,
      maxTenureMonths: 48,
      processingFeeType: "FLAT",
      processingFeeValue: 500,
      eligibilitySummary:
        "Min income ₹10,000/month. Valid driving license required. Age 18–65.",
      minCreditScore: 650,
      minIncome: 10000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "PCB",
      loanType: "VEHICLE",
      productName: "PCB Car Loan",
      minInterestRate: 10.0,
      maxInterestRate: 13.5,
      minAmount: 200000,
      maxAmount: 3000000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 1.5,
      processingFeeMin: 1000,
      processingFeeMax: 10000,
      eligibilitySummary:
        "Member of co-operative society. Min income ₹18,000/month.",
      minCreditScore: 660,
      minIncome: 18000,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },

    // ── Business Loans ──────────────────────────────────────────────────────
    {
      lenderId: "NCB",
      loanType: "BUSINESS",
      productName: "NCB MSME Growth Loan",
      minInterestRate: 11.5,
      maxInterestRate: 16.0,
      minAmount: 200000,
      maxAmount: 10000000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 2.0,
      processingFeeMin: 2000,
      processingFeeMax: 50000,
      eligibilitySummary:
        "Business in operation for min 2 years. ITR for last 2 years required. Turnover ≥ ₹20L/year.",
      minCreditScore: 680,
      minIncome: null,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
    {
      lenderId: "SPB",
      loanType: "BUSINESS",
      productName: "Swarna Business Flex",
      minInterestRate: 12.0,
      maxInterestRate: 18.0,
      minAmount: 100000,
      maxAmount: 5000000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      processingFeeType: "PERCENTAGE",
      processingFeeValue: 2.5,
      processingFeeMin: 1500,
      processingFeeMax: 35000,
      eligibilitySummary:
        "Self-employed professionals and small business owners. Min 1 year business vintage.",
      minCreditScore: 700,
      minIncome: null,
      dataSource: "Demo/Mock Data",
      isMock: true,
    },
  ];

  for (const product of products) {
    const { lenderId, processingFeeMin, processingFeeMax, ...rest } = product;
    await prisma.loanProduct.create({
      data: {
        ...rest,
        processingFeeMin: processingFeeMin ?? undefined,
        processingFeeMax: processingFeeMax ?? undefined,
        lenderId: createdLenders[lenderId] || lenderId,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("──────────────────────────────────────────────");
  console.log("Demo credentials:");
  console.log("  Admin  → admin@loanlens.in  / Admin@123");
  console.log("  User   → demo@loanlens.in   / Demo@123");
  console.log("──────────────────────────────────────────────");
  console.log(
    "⚠️  All lender/product data is FICTIONAL demo data only."
  );
  console.log(
    "   Do not use for actual financial decisions."
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
