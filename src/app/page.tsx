import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { EMIPreview } from "@/components/home/EMIPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LoanCategories } from "@/components/home/LoanCategories";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ArticlesSection } from "@/components/home/ArticlesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTABanner } from "@/components/home/CTABanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LoanLens — See Your Loan Clearly | Smart Loan Comparison India",
  description:
    "Compare home loans, personal loans, and more from top Indian banks. Calculate EMIs instantly, check loan readiness, and find the best offers — free.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <EMIPreview />
        <HowItWorks />
        <LoanCategories />
        <BenefitsSection />
        <ArticlesSection />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
