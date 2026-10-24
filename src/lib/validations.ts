import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── EMI Calculator ───────────────────────────────────────────────────────────
export const emiCalculatorSchema = z.object({
  loanAmount: z
    .number({ invalid_type_error: "Enter a valid loan amount" })
    .min(1000, "Minimum loan amount is ₹1,000")
    .max(100000000, "Maximum loan amount is ₹10 Crore"),
  annualRate: z
    .number({ invalid_type_error: "Enter a valid interest rate" })
    .min(0, "Interest rate cannot be negative")
    .max(60, "Interest rate seems unusually high — max 60%"),
  tenureMonths: z
    .number({ invalid_type_error: "Enter a valid tenure" })
    .int("Tenure must be whole months")
    .min(1, "Minimum tenure is 1 month")
    .max(360, "Maximum tenure is 360 months (30 years)"),
  processingFeePercent: z
    .number({ invalid_type_error: "Enter a valid processing fee" })
    .min(0, "Fee cannot be negative")
    .max(10, "Fee seems unusually high — max 10%")
    .optional()
    .default(0),
  loanType: z.string().optional(),
});

export type EMICalculatorInput = z.infer<typeof emiCalculatorSchema>;

// ─── Readiness Assessment ─────────────────────────────────────────────────────
export const readinessSchema = z.object({
  monthlyNetIncome: z
    .number({ invalid_type_error: "Enter your monthly income" })
    .min(1000, "Income must be at least ₹1,000")
    .max(10000000, "Please enter a realistic income figure"),
  employmentType: z.enum(["SALARIED", "SELF_EMPLOYED", "OTHER"]),
  employmentDurationMonths: z
    .number({ invalid_type_error: "Enter duration in months" })
    .int()
    .min(0, "Duration cannot be negative")
    .max(600, "Duration seems too long"),
  existingEmiTotal: z
    .number({ invalid_type_error: "Enter your existing EMI total" })
    .min(0, "Cannot be negative")
    .max(10000000),
  requestedLoanAmount: z
    .number({ invalid_type_error: "Enter the loan amount" })
    .min(1000, "Minimum ₹1,000")
    .max(100000000),
  desiredTenureMonths: z
    .number({ invalid_type_error: "Enter tenure in months" })
    .int()
    .min(1, "Minimum 1 month")
    .max(360, "Maximum 360 months"),
  estimatedCreditScore: z
    .number({ invalid_type_error: "Enter a valid score" })
    .int()
    .min(300, "Minimum CIBIL score is 300")
    .max(900, "Maximum CIBIL score is 900")
    .optional()
    .nullable(),
  monthlyExpenses: z
    .number({ invalid_type_error: "Enter monthly expenses" })
    .min(0)
    .max(10000000)
    .optional()
    .default(0),
  loanType: z.string().optional().default("PERSONAL"),
  consentGiven: z.boolean().refine((v) => v === true, {
    message:
      "You must agree to the data usage terms before saving the assessment",
  }),
});

export type ReadinessInput = z.infer<typeof readinessSchema>;

// ─── What-If Scenario ─────────────────────────────────────────────────────────
export const scenarioSchema = z.object({
  name: z.string().min(1, "Scenario name is required").max(100),
  scenarioData: z.record(z.unknown()),
});

// ─── Loan Comparison ─────────────────────────────────────────────────────────
export const saveLoanComparisonSchema = z.object({
  name: z.string().min(1).max(100).optional().default("My Comparison"),
  loanType: z.string(),
  items: z
    .array(
      z.object({
        loanProductId: z.string(),
        loanAmount: z.number().min(1),
        tenureMonths: z.number().int().min(1),
        estimatedRate: z.number().min(0),
        estimatedEmi: z.number().min(0),
        totalRepayment: z.number().min(0),
        position: z.number().int().min(1).max(3),
      })
    )
    .min(1, "At least one product required")
    .max(3, "Maximum 3 products for comparison"),
});

// ─── Admin – Lender ───────────────────────────────────────────────────────────
export const lenderSchema = z.object({
  name: z.string().min(2).max(200),
  shortName: z.string().min(2).max(20),
  type: z.enum(["PUBLIC_BANK", "PRIVATE_BANK", "NBFC", "COOPERATIVE"]),
  website: z.string().url().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  isMock: z.boolean().optional().default(false),
});

export const loanProductSchema = z.object({
  lenderId: z.string().min(1),
  loanType: z.enum(["PERSONAL", "HOME", "EDUCATION", "VEHICLE", "BUSINESS"]),
  productName: z.string().min(2).max(200),
  minInterestRate: z.number().min(0).max(100),
  maxInterestRate: z.number().min(0).max(100),
  minAmount: z.number().min(1),
  maxAmount: z.number().min(1),
  minTenureMonths: z.number().int().min(1),
  maxTenureMonths: z.number().int().min(1),
  processingFeeType: z.enum(["FLAT", "PERCENTAGE"]),
  processingFeeValue: z.number().min(0),
  processingFeeMin: z.number().min(0).optional().nullable(),
  processingFeeMax: z.number().min(0).optional().nullable(),
  eligibilitySummary: z.string().min(10).max(2000),
  minCreditScore: z.number().int().min(300).max(900).optional().nullable(),
  minIncome: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  isMock: z.boolean().optional().default(false),
  dataSource: z.string().optional().nullable(),
  lastVerifiedAt: z.string().datetime().optional().nullable(),
});
