import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { scenarioSchema } from "@/lib/validations";
import { inMemoryStore } from "@/lib/mockStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = scenarioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const scenario = await prisma.savedScenario.create({
        data: {
          userId: user.id,
          name: parsed.data.name,
          scenarioData: JSON.stringify(parsed.data.scenarioData),
        },
      });

      return NextResponse.json({ scenario }, { status: 201 });
    } catch {
      // In-memory fallback
      const dataObj = parsed.data.scenarioData as Record<string, unknown>;
      const newScenario = {
        id: `scen-${Date.now()}`,
        userId: user.id,
        name: parsed.data.name,
        loanAmount: Number(dataObj.loanAmount) || 2500000,
        annualRate: Number(dataObj.annualRate) || 8.5,
        tenureMonths: Number(dataObj.tenureMonths) || 180,
        downPayment: Number(dataObj.downPayment) || 500000,
        monthlyEMI: Number(dataObj.monthlyEMI) || 24628,
        disposableIncome: Number(dataObj.disposableIncome) || 45000,
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.scenarios.push(newScenario);
      return NextResponse.json({ scenario: newScenario }, { status: 201 });
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[scenarios]", err);
    return NextResponse.json({ error: "Failed to save scenario" }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const user = await requireUser();
    try {
      const scenarios = await prisma.savedScenario.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ scenarios });
    } catch {
      return NextResponse.json({ scenarios: inMemoryStore.scenarios });
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}
