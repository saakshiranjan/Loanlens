import { NextRequest, NextResponse } from "next/server";
import { emiCalculatorSchema } from "@/lib/validations";
import { calculateEMIFull } from "@/lib/finance";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = emiCalculatorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { loanAmount, annualRate, tenureMonths, processingFeePercent, loanType } =
      parsed.data;

    const result = calculateEMIFull(
      loanAmount,
      annualRate,
      tenureMonths,
      processingFeePercent
    );

    // Save to DB if user is logged in (optional, don't fail if not)
    try {
      const user = await requireUser();
      await prisma.loanCalculation.create({
        data: {
          userId: user.id,
          loanType: loanType || "PERSONAL",
          loanAmount,
          annualRate,
          tenureMonths,
          processingFee: processingFeePercent || 0,
          monthlyEmi: result.monthlyEMI,
          totalInterest: result.totalInterest,
          totalRepayment: result.totalRepayment,
          upfrontFee: result.upfrontFee,
        },
      });
    } catch {
      // Not logged in — calculation still works, just not saved
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[emi-calculate]", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
