"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/authErrors";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) showToast(errorParam, "error");
  }, [errorParam, showToast]);
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const supabase = createClient();

    try {
      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          showToast("Check your email to confirm your account — then come back here to get started.", "info");
          setLoading(false);
          return;
        }

        showToast(`Welcome to HelpingHands, ${name || email.split("@")[0]}!`, "success");
        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Welcome back!", "success");
        router.push("/explore");
      }
    } catch (err) {
      const message = friendlyAuthError(err);
      showToast(message, "error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-extrabold text-text-primary">
              Welcome to HelpingHands
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Join our community of changemakers
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6">
            <div className="flex bg-bg rounded-2xl p-1 mb-6">
              <button
                onClick={() => setTab("signin")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === "signin" ? "btn-gradient text-white" : "text-text-secondary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === "signup" ? "btn-gradient text-white" : "text-text-secondary"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "signup" && (
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="btn-gradient w-full py-3.5 rounded-2xl text-white font-bold text-sm mt-2 disabled:opacity-60 transition-opacity"
              >
                {loading ? "Just a moment…" : tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-text-muted">or</span>
              </div>
            </div>

            <Link
              href="/explore"
              className="block w-full py-3.5 rounded-2xl border border-border text-text-secondary text-sm font-semibold text-center hover:bg-border/40 transition-colors"
            >
              Continue as Guest
            </Link>
          </div>

          <p className="text-center text-xs text-text-muted mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
