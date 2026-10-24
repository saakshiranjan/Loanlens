// In-memory mock datastore for local development mode when PostgreSQL is not connected

export interface MockLender {
  id: string;
  name: string;
  shortName: string;
  type: string;
  website?: string | null;
  isMock: boolean;
  isActive: boolean;
}

export interface MockProduct {
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
  isActive: boolean;
  isMock: boolean;
  lenderId: string;
  lender: {
    id: string;
    name: string;
    shortName: string;
    type: string;
    isMock: boolean;
  };
}

export const MOCK_LENDERS: MockLender[] = [
  {
    id: "BSB",
    name: "Bharat State Bank",
    shortName: "BSB",
    type: "PUBLIC_BANK",
    website: "https://example.com/bsb",
    isMock: true,
    isActive: true,
  },
  {
    id: "IFB",
    name: "IndiaFirst Finance Bank",
    shortName: "IFB",
    type: "PRIVATE_BANK",
    website: "https://example.com/ifb",
    isMock: true,
    isActive: true,
  },
  {
    id: "NCB",
    name: "Navodaya Credit Bank",
    shortName: "NCB",
    type: "PRIVATE_BANK",
    website: "https://example.com/ncb",
    isMock: true,
    isActive: true,
  },
  {
    id: "DUN",
    name: "Desh Unnati NBFC",
    shortName: "DUN",
    type: "NBFC",
    website: "https://example.com/dun",
    isMock: true,
    isActive: true,
  },
  {
    id: "PCB",
    name: "Praja Co-operative Bank",
    shortName: "PCB",
    type: "COOPERATIVE",
    website: "https://example.com/pcb",
    isMock: true,
    isActive: true,
  },
  {
    id: "SPB",
    name: "Swarna Private Bank",
    shortName: "SPB",
    type: "PRIVATE_BANK",
    website: "https://example.com/spb",
    isMock: true,
    isActive: true,
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  // ─── HOME LOANS ─────────────────────────────────────────────────────────────
  {
    id: "hl-bsb-01",
    productName: "Bharat Griha Awas Home Loan",
    loanType: "HOME",
    minInterestRate: 8.4,
    maxInterestRate: 9.15,
    minAmount: 500000,
    maxAmount: 50000000,
    minTenureMonths: 60,
    maxTenureMonths: 360,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 0.35,
    eligibilitySummary: "Salaried or self-employed with min. 2 yrs experience; CIBIL score 700+",
    minCreditScore: 700,
    minIncome: 25000,
    isActive: true,
    isMock: true,
    lenderId: "BSB",
    lender: { id: "BSB", name: "Bharat State Bank", shortName: "BSB", type: "PUBLIC_BANK", isMock: true },
  },
  {
    id: "hl-ifb-01",
    productName: "IndiaFirst Express Home Loan",
    loanType: "HOME",
    minInterestRate: 8.65,
    maxInterestRate: 9.45,
    minAmount: 1000000,
    maxAmount: 75000000,
    minTenureMonths: 120,
    maxTenureMonths: 360,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 0.5,
    eligibilitySummary: "High CIBIL borrowers seeking rapid 48-hr in-principle sanction",
    minCreditScore: 725,
    minIncome: 40000,
    isActive: true,
    isMock: true,
    lenderId: "IFB",
    lender: { id: "IFB", name: "IndiaFirst Finance Bank", shortName: "IFB", type: "PRIVATE_BANK", isMock: true },
  },
  {
    id: "hl-dun-01",
    productName: "Desh Unnati Affordable Griha Loan",
    loanType: "HOME",
    minInterestRate: 9.1,
    maxInterestRate: 11.2,
    minAmount: 300000,
    maxAmount: 25000000,
    minTenureMonths: 60,
    maxTenureMonths: 240,
    processingFeeType: "FLAT",
    processingFeeValue: 4999,
    eligibilitySummary: "Flexible eligibility criteria; suitable for informal income documentation",
    minCreditScore: 650,
    minIncome: 18000,
    isActive: true,
    isMock: true,
    lenderId: "DUN",
    lender: { id: "DUN", name: "Desh Unnati NBFC", shortName: "DUN", type: "NBFC", isMock: true },
  },

  // ─── PERSONAL LOANS ─────────────────────────────────────────────────────────
  {
    id: "pl-ifb-01",
    productName: "IndiaFirst Prime Instant Personal Loan",
    loanType: "PERSONAL",
    minInterestRate: 10.49,
    maxInterestRate: 14.5,
    minAmount: 50000,
    maxAmount: 2500000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 1.5,
    eligibilitySummary: "Salaried professionals earning ₹35k+/month; 100% paperless digital sanction",
    minCreditScore: 720,
    minIncome: 35000,
    isActive: true,
    isMock: true,
    lenderId: "IFB",
    lender: { id: "IFB", name: "IndiaFirst Finance Bank", shortName: "IFB", type: "PRIVATE_BANK", isMock: true },
  },
  {
    id: "pl-bsb-01",
    productName: "BSB Saral Personal Loan",
    loanType: "PERSONAL",
    minInterestRate: 10.9,
    maxInterestRate: 13.9,
    minAmount: 25000,
    maxAmount: 2000000,
    minTenureMonths: 12,
    maxTenureMonths: 72,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 1.0,
    eligibilitySummary: "Existing salary account holders or government/PSU employees preferred",
    minCreditScore: 680,
    minIncome: 20000,
    isActive: true,
    isMock: true,
    lenderId: "BSB",
    lender: { id: "BSB", name: "Bharat State Bank", shortName: "BSB", type: "PUBLIC_BANK", isMock: true },
  },
  {
    id: "pl-dun-01",
    productName: "Desh Unnati Rapid Cash Personal Loan",
    loanType: "PERSONAL",
    minInterestRate: 12.99,
    maxInterestRate: 19.5,
    minAmount: 15000,
    maxAmount: 1000000,
    minTenureMonths: 6,
    maxTenureMonths: 48,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 2.5,
    eligibilitySummary: "Quick disbursement within 4 hours; open to self-employed and freelancers",
    minCreditScore: 620,
    minIncome: 15000,
    isActive: true,
    isMock: true,
    lenderId: "DUN",
    lender: { id: "DUN", name: "Desh Unnati NBFC", shortName: "DUN", type: "NBFC", isMock: true },
  },

  // ─── EDUCATION LOANS ───────────────────────────────────────────────────────
  {
    id: "el-bsb-01",
    productName: "Bharat Vidyarthi Global Education Loan",
    loanType: "EDUCATION",
    minInterestRate: 8.85,
    maxInterestRate: 10.25,
    minAmount: 100000,
    maxAmount: 15000000,
    minTenureMonths: 36,
    maxTenureMonths: 180,
    processingFeeType: "FLAT",
    processingFeeValue: 0,
    eligibilitySummary: "Secured admission in premier Indian or international universities; co-borrower required",
    minCreditScore: 680,
    minIncome: 20000,
    isActive: true,
    isMock: true,
    lenderId: "BSB",
    lender: { id: "BSB", name: "Bharat State Bank", shortName: "BSB", type: "PUBLIC_BANK", isMock: true },
  },
  {
    id: "el-ncb-01",
    productName: "Navodaya Scholar Abroad Loan",
    loanType: "EDUCATION",
    minInterestRate: 9.5,
    maxInterestRate: 12.0,
    minAmount: 500000,
    maxAmount: 20000000,
    minTenureMonths: 24,
    maxTenureMonths: 180,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 0.75,
    eligibilitySummary: "STEM and MBA programs overseas; covers 100% of tuition and living expenses",
    minCreditScore: 700,
    minIncome: 30000,
    isActive: true,
    isMock: true,
    lenderId: "NCB",
    lender: { id: "NCB", name: "Navodaya Credit Bank", shortName: "NCB", type: "PRIVATE_BANK", isMock: true },
  },

  // ─── VEHICLE LOANS ─────────────────────────────────────────────────────────
  {
    id: "vl-ifb-01",
    productName: "IndiaFirst Drive Smart Auto Loan",
    loanType: "VEHICLE",
    minInterestRate: 8.75,
    maxInterestRate: 9.85,
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    processingFeeType: "FLAT",
    processingFeeValue: 3500,
    eligibilitySummary: "Financing up to 90% of on-road vehicle price for new four-wheelers",
    minCreditScore: 700,
    minIncome: 25000,
    isActive: true,
    isMock: true,
    lenderId: "IFB",
    lender: { id: "IFB", name: "IndiaFirst Finance Bank", shortName: "IFB", type: "PRIVATE_BANK", isMock: true },
  },
  {
    id: "vl-pcb-01",
    productName: "Praja Sahakari Two-Wheeler Easy Loan",
    loanType: "VEHICLE",
    minInterestRate: 9.99,
    maxInterestRate: 12.5,
    minAmount: 25000,
    maxAmount: 300000,
    minTenureMonths: 12,
    maxTenureMonths: 48,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 1.0,
    eligibilitySummary: "EV and ICE two-wheelers; minimal documentation for rural and semi-urban buyers",
    minCreditScore: 640,
    minIncome: 12000,
    isActive: true,
    isMock: true,
    lenderId: "PCB",
    lender: { id: "PCB", name: "Praja Co-operative Bank", shortName: "PCB", type: "COOPERATIVE", isMock: true },
  },

  // ─── BUSINESS LOANS ────────────────────────────────────────────────────────
  {
    id: "bl-ncb-01",
    productName: "Navodaya MSME Pragati Business Loan",
    loanType: "BUSINESS",
    minInterestRate: 11.25,
    maxInterestRate: 15.5,
    minAmount: 500000,
    maxAmount: 20000000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    processingFeeType: "PERCENTAGE",
    processingFeeValue: 1.75,
    eligibilitySummary: "Minimum 3 years GST audited turnover; no collateral required up to ₹50 Lakhs",
    minCreditScore: 700,
    minIncome: 50000,
    isActive: true,
    isMock: true,
    lenderId: "NCB",
    lender: { id: "NCB", name: "Navodaya Credit Bank", shortName: "NCB", type: "PRIVATE_BANK", isMock: true },
  },
  {
    id: "bl-bsb-01",
    productName: "Bharat Udyam Shakti Mudra Loan",
    loanType: "BUSINESS",
    minInterestRate: 10.15,
    maxInterestRate: 13.5,
    minAmount: 100000,
    maxAmount: 10000000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    processingFeeType: "FLAT",
    processingFeeValue: 2000,
    eligibilitySummary: "Micro and small enterprises under Mudra/CGTMSE credit guarantee schemes",
    minCreditScore: 660,
    minIncome: 25000,
    isActive: true,
    isMock: true,
    lenderId: "BSB",
    lender: { id: "BSB", name: "Bharat State Bank", shortName: "BSB", type: "PUBLIC_BANK", isMock: true },
  },
];

// In-memory runtime state for local dev mode
export const inMemoryStore = {
  lenders: [...MOCK_LENDERS],
  products: [...MOCK_PRODUCTS],
  calculations: [
    {
      id: "calc-demo-1",
      userId: "demo-user-id",
      loanType: "HOME",
      amount: 4500000,
      annualRate: 8.5,
      tenureMonths: 240,
      monthlyEMI: 39049,
      totalInterest: 4871760,
      totalRepayment: 9371760,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "calc-demo-2",
      userId: "demo-user-id",
      loanType: "PERSONAL",
      amount: 500000,
      annualRate: 11.5,
      tenureMonths: 36,
      monthlyEMI: 16490,
      totalInterest: 93640,
      totalRepayment: 593640,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
  assessments: [
    {
      id: "assess-demo-1",
      userId: "demo-user-id",
      monthlyNetIncome: 75000,
      existingEMIs: 15000,
      requestedAmount: 3500000,
      desiredTenureMonths: 240,
      dtiRatio: 20.0,
      projectedDtiRatio: 60.5,
      estimatedEMI: 30375,
      readinessScore: 68,
      weaknesses: [
        "Projected aggregate debt-to-income exceeds optimal 50% threshold",
        "Requested loan tenure of 20 years incurs substantial compound interest",
      ],
      suggestions: [
        "Consider extending tenure to reduce monthly EMI burden",
        "Clear the existing ₹15,000 monthly debt first to free up borrowing capacity",
        "Increase upfront down payment by 10-15% to lower sanction requirement",
      ],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ],
  scenarios: [
    {
      id: "scen-demo-1",
      userId: "demo-user-id",
      name: "Aggressive 15-Year Repayment Plan",
      loanAmount: 4000000,
      annualRate: 8.5,
      tenureMonths: 180,
      downPayment: 1000000,
      monthlyEMI: 39390,
      disposableIncome: 35610,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ],
  comparisons: [
    {
      id: "comp-demo-1",
      userId: "demo-user-id",
      name: "Home Loan Top Pick Analysis",
      loanType: "HOME",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      items: [
        {
          id: "ci-1",
          loanProduct: {
            productName: "Bharat Griha Awas Home Loan",
            minInterestRate: 8.4,
            lender: { name: "Bharat State Bank", shortName: "BSB" },
          },
        },
        {
          id: "ci-2",
          loanProduct: {
            productName: "IndiaFirst Express Home Loan",
            minInterestRate: 8.65,
            lender: { name: "IndiaFirst Finance Bank", shortName: "IFB" },
          },
        },
      ],
    },
  ],
};
