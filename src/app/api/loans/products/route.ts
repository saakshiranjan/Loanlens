import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_PRODUCTS, inMemoryStore } from "@/lib/mockStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const loanType = searchParams.get("loanType");
    const sortBy = searchParams.get("sortBy") || "minInterestRate"; // minInterestRate | minAmount | minTenureMonths
    const lenderId = searchParams.get("lenderId");

    // Attempt database query first
    try {
      const where: Record<string, unknown> = { isActive: true };
      if (loanType) where.loanType = loanType.toUpperCase();
      if (lenderId) where.lenderId = lenderId;

      const validSorts = ["minInterestRate", "minAmount", "productName"];
      const orderBy = validSorts.includes(sortBy) ? sortBy : "minInterestRate";

      const products = await prisma.loanProduct.findMany({
        where,
        orderBy: { [orderBy]: "asc" },
        include: {
          lender: {
            select: {
              id: true,
              name: true,
              shortName: true,
              type: true,
              isMock: true,
            },
          },
        },
      });

      if (products && products.length > 0) {
        return NextResponse.json({ products });
      }
    } catch {
      // Prisma offline or unseeded — gracefully fallback to mock catalog below
    }

    // Local Development Fallback: In-Memory / Mock Store
    let list = inMemoryStore.products.filter((p) => p.isActive);
    if (loanType) {
      list = list.filter((p) => p.loanType.toUpperCase() === loanType.toUpperCase());
    }
    if (lenderId) {
      list = list.filter((p) => p.lenderId === lenderId);
    }

    list.sort((a, b) => {
      if (sortBy === "minAmount") return a.minAmount - b.minAmount;
      if (sortBy === "productName") return a.productName.localeCompare(b.productName);
      return a.minInterestRate - b.minInterestRate;
    });

    return NextResponse.json({ products: list });
  } catch (err) {
    console.error("[loan-products]", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
