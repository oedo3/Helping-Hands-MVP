"use client";

import Link from "next/link";
import { ArrowRight, Heart, Star, CheckCircle, Zap, Users, Bell, Clock, Shield, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

const STATS = [
  { value: "50K+", label: "Volunteers" },
  { value: "1.2K", label: "Organizations" },
  { value: "2M+", label: "Hours Served" },
  { value: "98%", label: "Match Rate" },
];

const FEATURES = [
  { icon: Zap, title: "Smart Matching", desc: "AI-powered event recommendations based on your interests, location, and schedule.", color: "#6C5CE7" },
  { icon: Star, title: "Impact Tracking", desc: "Visualize your volunteer hours and earn badges as you grow your community impact.", color: "#F39C12" },
  { icon: MessageCircle, title: "Direct Messaging", desc: "Communicate directly with organizations to coordinate your volunteer activities.", color: "#27AE60" },
  { icon: Shield, title: "Verified Hours", desc: "Get your volunteer hours verified by organizations for resumes and records.", color: "#2D8CFF" },
  { icon: Bell, title: "Quick Alerts", desc: "Receive instant notifications when new opportunities matching your interests open up.", color: "#E74C3C" },
  { icon: Users, title: "Team Building", desc: "Coordinate group volunteering sessions with friends, family, or coworkers.", color: "#FF8C42" },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Regular Volunteer",
    text: "HelpingHands made it so easy to find meaningful volunteer opportunities near me. I've logged over 120 hours in just 6 months!",
    hours: "120+ hours",
    avatar: "👩",
    stars: 5,
  },
  {
    name: "Michael R.",
    role: "Team Coordinator",
    text: "Our company uses HelpingHands to organize group volunteer days. The team coordination features are fantastic.",
    hours: "200+ hours",
    avatar: "👨",
    stars: 5,
  },
  {
    name: "Jordan K.",
    role: "Student Volunteer",
    text: "As a student, verified volunteer hours are crucial for my resume. HelpingHands made tracking and verification seamless.",
    hours: "85+ hours",
    avatar: "🧑",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-text-primary transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth?tab=signin" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
              Log In
            </Link>
            <Link href="/auth?tab=signup" className="btn-gradient px-4 py-2 rounded-xl text-white text-sm font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Heart size={12} />
          Trusted by 50,000+ volunteers
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
          Turn Your Good Intentions{" "}
          <span className="text-gradient">Into Real Impact</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with local volunteer opportunities that match your passions. Track your impact, earn verified badges, and build a legacy of service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/explore"
            className="btn-gradient px-8 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Get Matched Now
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/auth?tab=signin"
            className="px-8 py-4 rounded-2xl bg-card border border-border text-text-primary font-bold text-base hover:bg-border/40 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
              <p className="text-3xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-card border-y border-border/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-3">
              Everything You Need to{" "}
              <span className="text-gradient">Make a Difference</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Powerful tools designed to connect passionate volunteers with meaningful opportunities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-bg rounded-2xl p-6 border border-border/50 hover:shadow-md transition-shadow">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.color + "18" }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-text-primary mb-3">
            Voices of Our <span className="text-gradient">Community</span>
          </h2>
          <p className="text-text-secondary">Real stories from volunteers making a difference every day.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-secondary">{t.role} · {t.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-card border-y border-border/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="font-bold text-text-primary mb-4 text-lg">For Volunteers</h3>
              {[
                "Create your profile and set your interests",
                "Browse AI-matched volunteer opportunities",
                "Sign up and attend events near you",
                "Earn verified hours and achievement badges",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-text-secondary">{step}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-4 text-lg">For Organizations</h3>
              {[
                "Register your nonprofit or community group",
                "Post volunteer opportunities with ease",
                "Match with qualified, passionate volunteers",
                "Verify hours and track your community impact",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-text-secondary">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8 text-center">
        <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-12">
          <h2 className="text-3xl font-extrabold text-text-primary mb-4">
            Ready to Make Your <span className="text-gradient">Mark?</span>
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Join thousands of volunteers already making a difference in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="btn-gradient px-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <CheckCircle size={18} />
              Start Volunteering
            </Link>
            <Link
              href="/auth?tab=signup"
              className="px-8 py-4 rounded-2xl bg-bg border border-border text-text-primary font-bold hover:bg-border/40 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-text-muted">© 2026 HelpingHands. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Sticky demo banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Link
          href="/explore"
          className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-xl hover:opacity-90 transition-opacity"
        >
          <Zap size={15} />
          Try the App
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
