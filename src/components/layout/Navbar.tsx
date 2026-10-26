"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calculator,
  ChevronDown,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/calculator", label: "EMI Calculator", icon: Calculator },
  { href: "/compare", label: "Compare Loans", icon: BarChart3 },
  { href: "/readiness", label: "Readiness Check", icon: Zap },
  { href: "/simulator", label: "What-If Simulator", icon: TrendingUp },
  { href: "/bpmn-er", label: "Bank Model", icon: GitBranch },
];

export function Navbar() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isHeroPage = pathname === "/";

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isHeroPage
          ? "bg-navy-950/90 backdrop-blur-md border-b border-white/10"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
      )}
    >
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="LoanLens Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <span className="text-white font-bold text-lg leading-none">L</span>
            </div>
            <div>
              <span
                className={cn(
                  "font-display font-bold text-xl",
                  isHeroPage ? "text-white" : "text-navy-950"
                )}
              >
                LoanLens
              </span>
              <span
                className={cn(
                  "block text-[10px] font-medium -mt-0.5",
                  isHeroPage ? "text-teal-400" : "text-teal-600"
                )}
              >
                See Your Loan Clearly
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 underline-animate",
                  pathname === href
                    ? isHeroPage
                      ? "text-teal-400 bg-white/10"
                      : "text-teal-600 bg-teal-50"
                    : isHeroPage
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-50"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isHeroPage
                      ? "text-white hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-navy-700 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", profileOpen && "rotate-180")} />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-20 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        My Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-violet-600" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    isHeroPage
                      ? "text-white hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-btn"
            className={cn(
              "lg:hidden p-2 rounded-lg",
              isHeroPage ? "text-white" : "text-slate-700"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={cn(
            "lg:hidden border-t",
            isHeroPage
              ? "bg-navy-950 border-white/10"
              : "bg-white border-slate-200"
          )}
        >
          <div className="section-padding py-4 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === href
                    ? isHeroPage
                      ? "text-teal-400 bg-white/10"
                      : "text-teal-600 bg-teal-50"
                    : isHeroPage
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                      isHeroPage ? "text-white/80" : "text-slate-700"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-semibold text-center",
                      isHeroPage ? "text-white border border-white/30" : "text-slate-700 border border-slate-200"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="block btn-primary text-center"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
