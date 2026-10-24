import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { lenderSchema } from "@/lib/validations";
import { inMemoryStore } from "@/lib/mockStore";

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin();

    try {
      const lenders = await prisma.lender.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { loanProducts: true } } },
      });
      if (lenders && lenders.length > 0) {
        return NextResponse.json({ lenders });
      }
    } catch {
      // Prisma offline or unseeded
    }

    // Local dev mode fallback
    const formatted = inMemoryStore.lenders.map((l) => ({
      ...l,
      _count: {
        loanProducts: inMemoryStore.products.filter((p) => p.lenderId === l.id).length,
      },
    }));

    return NextResponse.json({ lenders: formatted });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = lenderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const lender = await prisma.lender.create({ data: parsed.data });
      return NextResponse.json({ lender }, { status: 201 });
    } catch {
      // Fallback in-memory create
      const newLender = {
        id: parsed.data.shortName,
        ...parsed.data,
      };
      inMemoryStore.lenders.push(newLender);
      return NextResponse.json({ lender: newLender }, { status: 201 });
    }
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
