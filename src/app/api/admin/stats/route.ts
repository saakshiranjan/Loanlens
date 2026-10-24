import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inMemoryStore } from "@/lib/mockStore";

export const dynamic = "force-dynamic";

// GET /api/admin/stats
export async function GET(_req: NextRequest) {
  try {
    await requireAdmin();

    try {
      const [
        totalUsers,
        totalCalculations,
        totalAssessments,
        totalLenders,
        totalProducts,
        recentUsers,
      ] = await Promise.all([
        prisma.userProfile.count(),
        prisma.loanCalculation.count(),
        prisma.readinessAssessment.count(),
        prisma.lender.count({ where: { isActive: true } }),
        prisma.loanProduct.count({ where: { isActive: true } }),
        prisma.userProfile.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        }),
      ]);

      return NextResponse.json({
        stats: {
          totalUsers,
          totalCalculations,
          totalAssessments,
          totalLenders,
          totalProducts,
        },
        recentUsers,
      });
    } catch {
      // Local dev mode fallback
      return NextResponse.json({
        stats: {
          totalUsers: 2,
          totalCalculations: inMemoryStore.calculations.length,
          totalAssessments: inMemoryStore.assessments.length,
          totalLenders: inMemoryStore.lenders.length,
          totalProducts: inMemoryStore.products.length,
        },
        recentUsers: [
          {
            id: "user-1",
            name: "Priya Sharma",
            email: "demo@loanlens.in",
            role: "USER",
            createdAt: new Date().toISOString(),
          },
          {
            id: "user-2",
            name: "LoanLens Admin",
            email: "admin@loanlens.in",
            role: "ADMIN",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[admin-stats]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
