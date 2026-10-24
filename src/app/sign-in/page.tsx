"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations";
import type { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setGlobalError("");
    const result = await signIn(data.email, data.password);
    if (result.error) {
      setGlobalError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl text-white">LoanLens</span>
              <span className="block text-xs text-teal-400">See Your Loan Clearly</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-navy-950 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Sign in to your LoanLens account
          </p>

          {/* Demo credentials hint */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-6 text-xs text-teal-800">
            <strong>Demo Credentials:</strong><br />
            User: demo@loanlens.in / Demo@123<br />
            Admin: admin@loanlens.in / Admin@123
          </div>

          {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("email")}
              id="signin-email"
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
                id="signin-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
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

            <Button
              type="submit"
              id="signin-submit-btn"
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-teal-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
