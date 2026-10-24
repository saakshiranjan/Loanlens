import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LoanLens — See Your Loan Clearly",
    template: "%s | LoanLens",
  },
  description:
    "LoanLens is India's smart loan assistant. Compare loans from multiple banks, calculate EMIs instantly, check your loan readiness, and simulate what-if scenarios — all in one place.",
  keywords: [
    "loan comparison India",
    "EMI calculator",
    "home loan calculator",
    "personal loan",
    "CIBIL score",
    "loan readiness",
    "Indian banking",
    "LoanLens",
  ],
  openGraph: {
    title: "LoanLens — See Your Loan Clearly",
    description:
      "Compare loans, calculate EMIs, and check your readiness before applying.",
    url: "https://loanlens.in",
    siteName: "LoanLens",
    locale: "en_IN",
    type: "website",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
