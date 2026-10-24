import { signToken, verifyToken, isAdmin, type SessionPayload } from "@/lib/auth";

describe("LoanLens Authentication & Authorization Engine", () => {
  const mockUserPayload: SessionPayload = {
    userId: "user-12345",
    email: "testuser@example.com",
    role: "USER",
    name: "Test User",
  };

  const mockAdminPayload: SessionPayload = {
    userId: "admin-99999",
    email: "superadmin@loanlens.in",
    role: "ADMIN",
    name: "System Administrator",
  };

  test("generates and cryptographically verifies JWT session tokens", async () => {
    const token = await signToken(mockUserPayload);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");

    const verified = await verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(mockUserPayload.userId);
    expect(verified?.email).toBe(mockUserPayload.email);
    expect(verified?.role).toBe(mockUserPayload.role);
  });

  test("rejects tampered or malformed JWT tokens", async () => {
    const validToken = await signToken(mockUserPayload);
    const tamperedToken = validToken.slice(0, -6) + "xyz123";

    const result = await verifyToken(tamperedToken);
    expect(result).toBeNull();

    const invalidResult = await verifyToken("completely.invalid.token");
    expect(invalidResult).toBeNull();
  });

  test("enforces role segregation between normal users and administrators", () => {
    expect(isAdmin(mockUserPayload.role)).toBe(false);
    expect(isAdmin(mockAdminPayload.role)).toBe(true);
    expect(isAdmin("GUEST")).toBe(false);
    expect(isAdmin("")).toBe(false);
  });
});
