import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { calculateReadiness } from "@/lib/readiness";
import { readinessSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = readinessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const result = calculateReadiness({
      ...input,
      estimatedCreditScore: input.estimatedCreditScore ?? undefined,
      monthlyExpenses: input.monthlyExpenses ?? 0,
    });

    // Save to DB only if user is logged in AND consent given
    let savedId: string | null = null;
    if (input.consentGiven) {
      try {
        const user = await requireUser();
        const assessment = await prisma.readinessAssessment.create({
          data: {
            userId: user.id,
            monthlyNetIncome: input.monthlyNetIncome,
            employmentType: input.employmentType,
            employmentDuration: input.employmentDurationMonths,
            existingEmiTotal: input.existingEmiTotal,
            requestedLoanAmount: input.requestedLoanAmount,
            desiredTenureMonths: input.desiredTenureMonths,
            estimatedCreditScore: input.estimatedCreditScore ?? null,
            monthlyExpenses: input.monthlyExpenses ?? 0,
            loanType: input.loanType || "PERSONAL",
            debtToIncomeRatio: result.debtToIncomeRatio,
            estimatedNewEmi: result.estimatedNewEmi,
            totalEmiToIncome: result.totalEmiToIncome,
            disposableIncome: result.disposableIncome,
            readinessScore: result.readinessScore,
            weaknesses: JSON.stringify(result.weaknesses),
            suggestions: JSON.stringify(result.suggestions),
            consentGiven: true,
          },
        });
        savedId = assessment.id;
      } catch {
        // Not logged in — still return results
      }
    }

    return NextResponse.json({ result, savedId });
  } catch (err) {
    console.error("[readiness]", err);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
