import Link from "next/link";
import {
  BarChart3,
  Calculator,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Twitter,
  Zap,
} from "lucide-react";

const TOOL_LINKS = [
  { href: "/calculator", label: "EMI Calculator", icon: Calculator },
  { href: "/compare", label: "Compare Loans", icon: BarChart3 },
  { href: "/readiness", label: "Readiness Check", icon: Zap },
  { href: "/simulator", label: "What-If Simulator", icon: TrendingUp },
];

const LOAN_LINKS = [
  { href: "/compare?type=PERSONAL", label: "Personal Loans" },
  { href: "/compare?type=HOME", label: "Home Loans" },
  { href: "/compare?type=EDUCATION", label: "Education Loans" },
  { href: "/compare?type=VEHICLE", label: "Vehicle Loans" },
  { href: "/compare?type=BUSINESS", label: "Business Loans" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/business-model", label: "Business Model" },
  { href: "/disclaimer", label: "Financial Disclaimer" },
];

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/80">
      {/* Main Footer */}
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white">LoanLens</span>
                <span className="block text-[10px] font-medium text-teal-400 -mt-0.5">
                  See Your Loan Clearly
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              India&rsquo;s smart loan comparison and financial planning platform.
              Making borrowing decisions transparent and informed.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors"
                  aria-label="Social Media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-3">
              {TOOL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Types */}
          <div>
            <h3 className="font-semibold text-white mb-4">Loan Types</h3>
            <ul className="space-y-3">
              {LOAN_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 mb-6">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>hello@loanlens.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <div className="container-max section-padding py-6">
          <div className="flex items-start gap-2 mb-4 bg-white/5 rounded-xl p-4">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">
              <strong className="text-amber-400">Financial Disclaimer:</strong>{" "}
              LoanLens is an educational and comparison platform only. All loan
              rates, offers, and calculations shown are indicative and for
              demonstration purposes. Actual rates may differ. Lender data
              marked as &ldquo;Demo&rdquo; is fictional and does not represent real bank
              offers. LoanLens does not provide financial advice and is not a
              licensed lender or broker. Always verify with the respective lender
              before making any financial decisions. We do not collect banking
              passwords, OTPs, card PINs, or internet banking credentials.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 LoanLens. All rights reserved.</p>
            <p>
              Demo data only — not affiliated with any real bank or financial institution
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
