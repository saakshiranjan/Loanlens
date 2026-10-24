"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations";
import type { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, CheckCircle2 } from "lucide-react";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    if (!consentGiven) {
      setGlobalError("You must agree to the Terms of Service & Privacy Policy to continue.");
      return;
    }
    setGlobalError("");
    const result = await signUp(data.name, data.email, data.password, data.confirmPassword);
    if (result.error) {
      setGlobalError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl text-white">LoanLens</span>
              <span className="block text-xs text-teal-400">See Your Loan Clearly</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <h1 className="font-display text-2xl font-bold text-navy-950 mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Compare loans, calculate EMIs, and assess readiness with confidence.
          </p>

          {/* Security & Privacy Highlight */}
          <div className="bg-teal-50/80 border border-teal-200/60 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-xs text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Privacy First:</span> We never ask for bank passwords, OTPs, or debit card PINs. All data is strictly protected.
            </div>
          </div>

          {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("name")}
              id="signup-name"
              label="Full Name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              autoComplete="name"
              required
            />

            <Input
              {...register("email")}
              id="signup-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                {...register("password")}
                id="signup-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="signup-confirm-password"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password requirements hint */}
            <div className="text-xs text-slate-500 space-y-1 py-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>At least 8 characters with 1 uppercase letter & 1 number</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-teal-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
                . I understand LoanLens provides educational assessments, not official credit approvals.
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
