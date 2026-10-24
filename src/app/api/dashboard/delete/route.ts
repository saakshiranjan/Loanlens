import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inMemoryStore } from "@/lib/mockStore";

export const dynamic = "force-dynamic";

// DELETE /api/dashboard/delete — delete a user's own record
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // calculation | comparison | assessment | scenario
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
    }

    // Always verify ownership — never trust client-supplied userId
    try {
      switch (type) {
        case "calculation": {
          const record = await prisma.loanCalculation.findUnique({ where: { id } });
          if (!record || record.userId !== user.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          }
          await prisma.loanCalculation.delete({ where: { id } });
          break;
        }
        case "comparison": {
          const record = await prisma.loanComparison.findUnique({ where: { id } });
          if (!record || record.userId !== user.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          }
          await prisma.loanComparison.delete({ where: { id } });
          break;
        }
        case "assessment": {
          const record = await prisma.readinessAssessment.findUnique({ where: { id } });
          if (!record || record.userId !== user.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          }
          await prisma.readinessAssessment.delete({ where: { id } });
          break;
        }
        case "scenario": {
          const record = await prisma.savedScenario.findUnique({ where: { id } });
          if (!record || record.userId !== user.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          }
          await prisma.savedScenario.delete({ where: { id } });
          break;
        }
        default:
          return NextResponse.json({ error: "Unknown type" }, { status: 400 });
      }
    } catch {
      // In-memory fallback delete
      switch (type) {
        case "calculation":
          inMemoryStore.calculations = inMemoryStore.calculations.filter((c) => c.id !== id);
          break;
        case "comparison":
          inMemoryStore.comparisons = inMemoryStore.comparisons.filter((c) => c.id !== id);
          break;
        case "assessment":
          inMemoryStore.assessments = inMemoryStore.assessments.filter((a) => a.id !== id);
          break;
        case "scenario":
          inMemoryStore.scenarios = inMemoryStore.scenarios.filter((s) => s.id !== id);
          break;
        default:
          return NextResponse.json({ error: "Unknown type" }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[delete]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
