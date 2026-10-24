import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inMemoryStore } from "@/lib/mockStore";

export const dynamic = "force-dynamic";

// GET /api/dashboard — fetch all user dashboard data
export async function GET(_req: NextRequest) {
  try {
    const user = await requireUser();

    try {
      const [calculations, comparisons, assessments, scenarios] =
        await Promise.all([
          prisma.loanCalculation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
          }),
          prisma.loanComparison.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { items: { include: { loanProduct: { include: { lender: true } } } } },
          }),
          prisma.readinessAssessment.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
          }),
          prisma.savedScenario.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
          }),
        ]);

      return NextResponse.json({
        calculations,
        comparisons,
        assessments,
        scenarios,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          monthlyIncome: user.monthlyIncome,
          employmentType: user.employmentType,
          creditScoreRange: user.creditScoreRange,
          createdAt: user.createdAt,
        },
      });
    } catch {
      // Prisma offline or local dev mock mode
      return NextResponse.json({
        calculations: inMemoryStore.calculations,
        comparisons: inMemoryStore.comparisons,
        assessments: inMemoryStore.assessments,
        scenarios: inMemoryStore.scenarios,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          monthlyIncome: user.monthlyIncome || 75000,
          employmentType: user.employmentType || "SALARIED",
          creditScoreRange: user.creditScoreRange || "GOOD",
          createdAt: user.createdAt || new Date().toISOString(),
        },
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[dashboard]", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
