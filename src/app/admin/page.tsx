"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import {
  ShieldAlert,
  Building2,
  Users,
  Calculator,
  Gauge,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Calendar,
  Database,
  ArrowUpRight,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalCalculations: number;
  totalAssessments: number;
  totalLenders: number;
  totalProducts: number;
}

interface LenderItem {
  id: string;
  name: string;
  shortName: string;
  type: string;
  website?: string | null;
  isActive: boolean;
  isMock: boolean;
  _count?: { loanProducts: number };
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [lenders, setLenders] = useState<LenderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "lenders" | "verification">("overview");

  // Form state for adding lender
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  const [newType, setNewType] = useState("PUBLIC_BANK");
  const [newWebsite, setNewWebsite] = useState("https://example.com");
  const [newIsMock, setNewIsMock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, lendersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/lenders"),
      ]);

      if (statsRes.status === 403 || statsRes.status === 401) {
        toast({ type: "error", title: "Access Denied", message: "Administrator credentials required." });
        router.push("/dashboard");
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentUsers(statsData.recentUsers || []);
      }

      if (lendersRes.ok) {
        const lendersData = await lendersRes.json();
        setLenders(lendersData.lenders || []);
      }
    } catch {
      toast({ type: "error", title: "Error", message: "Failed to load admin telemetry." });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (!isAdmin) {
        toast({ type: "error", title: "Unauthorized", message: "Only administrators may access this portal." });
        router.push("/dashboard");
      } else {
        fetchAdminData();
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router, fetchAdminData]);

  const handleCreateLender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newShortName) {
      toast({ type: "warning", title: "Required", message: "Please fill in lender name and short code." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/lenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          shortName: newShortName.toUpperCase(),
          type: newType,
          website: newWebsite,
          isMock: newIsMock,
          isActive: true,
        }),
      });

      if (res.ok) {
        toast({ type: "success", title: "Lender Added", message: "Institution created successfully." });
        setShowAddModal(false);
        setNewName("");
        setNewShortName("");
        fetchAdminData();
      } else {
        const err = await res.json();
        toast({ type: "error", title: "Creation Failed", message: err.error || "Unable to save lender." });
      }
    } catch {
      toast({ type: "error", title: "Network Error", message: "Please verify network connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 text-sm">Authenticating administrative credentials...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Admin Header */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden mb-8 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Restricted Administrative Portal</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Platform Management & Offer Audit
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Maintain lender catalogs, configure indicative interest rate feeds, and monitor consumer readiness check metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAdminData()}
                className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Telemetry
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Lender
              </Button>
            </div>
          </div>

          {/* Demo Guardrail Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2.5 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Compliance Guardrail:</strong> In adherence with fair lending policies, all sample bank loan products must be clearly flagged as mock/indicative data. No direct bank endorsement is implied.
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Registered Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Total account holders</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">EMI Calculations</span>
                <Calculator className="w-4 h-4 text-teal-600" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats?.totalCalculations || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Calculations executed</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Readiness Runs</span>
                <Gauge className="w-4 h-4 text-amber-600" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats?.totalAssessments || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">DTI & risk evaluations</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Lenders</span>
                <Building2 className="w-4 h-4 text-violet-600" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats?.totalLenders || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Banking institutions</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 col-span-2 lg:col-span-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Catalog Products</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats?.totalProducts || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Loan offerings published</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-teal-600 text-teal-700 bg-teal-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Lender Catalog & Offers ({lenders.length})
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "verification"
                ? "border-teal-600 text-teal-700 bg-teal-50/50"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Offer Verification & Audit
          </button>
        </div>

        {/* Tab Content: Lenders Table */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Configured Lending Institutions</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Manage partner banks, NBFCs, and sample comparison profiles</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-1" /> New Lender
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4 font-semibold">Lender Name</th>
                        <th className="py-3 px-4 font-semibold">Code</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Products</th>
                        <th className="py-3 px-4 font-semibold">Data Nature</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lenders.map((lender) => (
                        <tr key={lender.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900">{lender.name}</span>
                            {lender.website && (
                              <a
                                href={lender.website}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-xs text-slate-400 hover:text-teal-600 truncate max-w-xs"
                              >
                                {lender.website}
                              </a>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600">
                            {lender.shortName}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {lender.type.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                            {lender._count?.loanProducts ?? "—"} products
                          </td>
                          <td className="py-3 px-4">
                            {lender.isMock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Mock / Demo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                Verified Live
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {lender.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-semibold">
                                <XCircle className="w-3.5 h-3.5" /> Deactivated
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recent Registered Users */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Recent User Accounts</CardTitle>
                <p className="text-xs text-slate-500">Latest platform accounts registered for audit and compliance</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4 font-semibold">User</th>
                        <th className="py-3 px-4 font-semibold">Email</th>
                        <th className="py-3 px-4 font-semibold">Role</th>
                        <th className="py-3 px-4 font-semibold">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-medium text-slate-900">{u.name || "Anonymous"}</td>
                          <td className="py-3 px-4 text-xs font-mono text-slate-600">{u.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                u.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Verification & Source Tracking */}
        {activeTab === "verification" && (
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Loan Offer Source & Verification Records</CardTitle>
                <p className="text-xs text-slate-500">
                  Regulatory requirement (Section 11): Record the exact source and last verification date for each banking offer.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Quarterly Verification Schedule:</span> Indicative rates are re-verified against official schedule circulars every 90 days. Next scheduled verification cycle: Q1 2027.
                  </div>
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  {[
                    {
                      product: "Bharat Super Home Loan",
                      lender: "Bharat State Bank",
                      rate: "8.40% – 9.15%",
                      source: "BSB Public Master Lending Circular 2026/04 (Demo)",
                      verifiedOn: "2026-09-15",
                      verifier: "Admin Compliance Officer",
                    },
                    {
                      product: "IndiaFirst Express Personal Loan",
                      lender: "IndiaFirst Finance Bank",
                      rate: "10.49% – 14.50%",
                      source: "IFB Retail Tariff Card Oct 2026 (Demo)",
                      verifiedOn: "2026-10-01",
                      verifier: "Admin Compliance Officer",
                    },
                    {
                      product: "Navodaya Pragati Business Loan",
                      lender: "Navodaya Credit Bank",
                      rate: "11.25% – 16.00%",
                      source: "NCB MSME Schedule of Charges (Demo)",
                      verifiedOn: "2026-08-20",
                      verifier: "Admin Compliance Officer",
                    },
                    {
                      product: "Desh Unnati Two-Wheeler Easy Loan",
                      lender: "Desh Unnati NBFC",
                      rate: "9.99% – 13.50%",
                      source: "DUN Auto Finance Rate Card (Demo)",
                      verifiedOn: "2026-09-28",
                      verifier: "Admin Compliance Officer",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{item.product}</span>
                          <span className="text-slate-500">({item.lender})</span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          Source: <span className="font-medium text-slate-700">{item.source}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div>
                          <span className="text-slate-400 block">Indicative Rate</span>
                          <span className="font-semibold text-teal-700">{item.rate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Last Verified</span>
                          <span className="font-mono text-slate-700">{item.verifiedOn}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          Audited
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Lender Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-xl text-slate-900">Add Lending Institution</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLender} className="space-y-4 text-sm">
                <Input
                  id="lender-name"
                  label="Institution Full Name"
                  placeholder="e.g. Sahyadri Rural Bank"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />

                <Input
                  id="lender-code"
                  label="Short Code / Acronym (Unique)"
                  placeholder="e.g. SRB"
                  value={newShortName}
                  onChange={(e) => setNewShortName(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="PUBLIC_BANK">Public Sector Bank (PSB)</option>
                    <option value="PRIVATE_BANK">Private Sector Bank</option>
                    <option value="NBFC">Non-Banking Financial Company (NBFC)</option>
                    <option value="COOPERATIVE">Co-operative Bank</option>
                  </select>
                </div>

                <Input
                  id="lender-url"
                  label="Official Website"
                  placeholder="https://example.com"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                />

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={newIsMock}
                    onChange={(e) => setNewIsMock(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span className="text-xs text-slate-700">
                    Flag as <strong>Mock / Demo Data</strong> (fair lending transparency)
                  </span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                    Save Institution
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
