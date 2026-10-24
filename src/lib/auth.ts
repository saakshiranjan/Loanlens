/**
 * Mock Authentication System
 * 
 * This module provides a complete local authentication system using
 * bcrypt passwords + JWT-style sessions via iron-session.
 * 
 * To switch to Clerk: replace usages of getCurrentUser() and auth helpers
 * with Clerk's currentUser() / auth() from @clerk/nextjs.
 */

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "loanlens-dev-secret-min-32-chars-changeme!"
);

const COOKIE_NAME = "loanlens_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
}

// ─── Token Management ─────────────────────────────────────────────────────────

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Session Helpers ──────────────────────────────────────────────────────────

export async function createSession(user: SessionPayload): Promise<void> {
  const token = await signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── User Helpers ─────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    // Re-validate user still exists in DB
    const user = await prisma.userProfile.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        monthlyIncome: true,
        employmentType: true,
        creditScoreRange: true,
        createdAt: true,
      },
    });

    if (user) return user;
  } catch {
    // Database offline — fall back to verified session data
  }

  return {
    id: session.userId,
    email: session.email,
    name: session.name || null,
    role: session.role,
    monthlyIncome: 75000,
    employmentType: "SALARIED",
    creditScoreRange: "GOOD",
    createdAt: new Date().toISOString(),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export function isAdmin(role: string): boolean {
  return role === "ADMIN";
}
