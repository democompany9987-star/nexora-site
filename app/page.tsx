"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplineHeroFallback />,
});

const employees = [
  ["Admin AI", "Tasks, reminders, updates and daily admin handled."],
  ["Email AI", "Reads inboxes, drafts replies and flags urgent messages."],
  ["CRM AI", "Adds leads, updates contacts and keeps pipelines moving."],
  ["Finance AI", "Prepares invoices, tracks billing and payment tasks."],
  ["Reporting AI", "Turns daily activity into clear business reports."],
  ["Workflow AI", "Connects your tools and runs repeatable processes."],
];

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const pageRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 900], [0, -160]);
  const gridY = useTransform(scrollY, [0, 900], [0, 120]);
  const robotY = useTransform(scrollY, [0, 900], [0, -70]);
  const glowY = useTransform(scrollY, [0, 900], [0, 180]);

  function openDemo() {
    setFormError("");
    setSubmitted(false);
    setDemoOpen(true);
  }

  function closeDemo() {
    setDemoOpen(false);
    setSubmitted(false);
    setSubmitting(false);
    setFormError("");
  }

   async function submitLeadForm(form: HTMLFormElement) {
  if (submitting) return;

  setSubmitting(true);
  setFormError("Sending enquiry...");

  const formData = new FormData(form);

  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const automationRequest = String(
    formData.get("automation_request") || ""
  ).trim();

  if (!name || !company || !email || !automationRequest) {
    setFormError("Please complete all required fields.");
    setSubmitting(false);
    return;
  }

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        company,
        email,
        phone,
        automation_request: automationRequest,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error || "Something went wrong. Please try again."
      );
    }

    form.reset();
    setFormError("");
    setSubmitting(false);
    setSubmitted(true);

    window.setTimeout(() => {
      document
        .getElementById("demo-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  } catch (error) {
    console.error("Lead submission failed:", error);

    setFormError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );

    setSubmitting(false);
  }
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  await submitLeadForm(e.currentTarget);
}

  useGSAP(
    () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (isMobile) {
        gsap.set(".reveal-card, .machine-step", {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          clearProps: "transform,opacity",
        });

        return;
      }

      gsap.fromTo(
        ".reveal-card",
        {
          opacity: 0,
          y: 60,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".employee-grid",
            start: "top 80%",
            end: "bottom 55%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        ".machine-step",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".machine-section",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 1,
          },
        }
      );
    },
    {
      scope: pageRef,
    }
  );

  return (
    <main
      ref={pageRef}
      className="overflow-hidden bg-black text-white"
    >
      <style jsx global>{`
        @keyframes mobileWaveA {
          0%, 100% { transform: translate3d(-10%, 0, 0) rotate(-2deg) scaleX(1.08); }
          50% { transform: translate3d(8%, -18px, 0) rotate(2deg) scaleX(1.16); }
        }
        @keyframes mobileWaveB {
          0%, 100% { transform: translate3d(8%, 0, 0) rotate(2deg) scaleX(1.12); }
          50% { transform: translate3d(-12%, 16px, 0) rotate(-2deg) scaleX(1.04); }
        }
        @keyframes mobileGlow {
          0%, 100% { opacity: .45; transform: translate(-50%, -50%) scale(.95); }
          50% { opacity: .8; transform: translate(-50%, -50%) scale(1.08); }
        }
        @media (max-width: 767px) {
          .mobile-force-visible,
          .reveal-card,
          .machine-step {
            opacity: 1 !important;
            transform: none !important;
          }

          .mobile-force-visible,
          .reveal-card,
          .machine-step {
            visibility: visible !important;
          }
        }
      `}</style>
      {/* NAVIGATION */}

      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-black/72 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/80 to-transparent" />
        <motion.div
          animate={{
            x: ["-35%", "35%", "-35%"],
            opacity: [0.25, 0.75, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-1/2 top-0 h-16 w-[820px] -translate-x-1/2 bg-gradient-to-r from-cyan-400/[0.04] via-violet-500/[0.07] to-fuchsia-500/[0.035] blur-3xl"
        />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <a href="#" className="group flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.16, 1],
                  opacity: [0.35, 0.85, 0.35],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-[-8px] rounded-2xl bg-cyan-400/20 blur-xl"
              />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.18)]">
                <motion.span
                  animate={{
                    color: ["#67e8f9", "#a855f7", "#ec4899", "#67e8f9"],
                    textShadow: [
                      "0 0 8px rgba(103,232,249,0.5)",
                      "0 0 18px rgba(168,85,247,0.9)",
                      "0 0 14px rgba(236,72,153,0.8)",
                      "0 0 8px rgba(103,232,249,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-sm font-black"
                >
                  N
                </motion.span>
              </div>
            </div>

            <div>
              <div className="text-xl font-black tracking-tight sm:text-2xl">
                NEXORA
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.32em] text-cyan-300/60 sm:block">
                AI Workforce OS
              </div>
            </div>
          </a>

          <div className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1 text-sm text-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:flex">
            {[
              { label: "Platform", href: "#platform" },
              { label: "AI Workforce", href: "#ai" },
              { label: "How It Works", href: "#platform" },
              { label: "Contact", href: "#demo" },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative rounded-full px-4 py-2.5 font-medium tracking-[-0.01em] transition-colors duration-300 hover:text-white lg:px-5"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
                <span className="absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-cyan-400/[0.06] to-violet-500/[0.08] opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                opacity: [0.55, 1, 0.55],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.055] px-3 py-2 text-[11px] text-emerald-300/85 xl:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              Core online
            </motion.div>

            <a
              href="#demo-form"
              className="group relative z-[80] touch-manipulation overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.14)] transition hover:bg-cyan-400/20 sm:px-5 sm:text-sm"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="pointer-events-none relative z-10">Request a Demo →</span>
            </a>
          </div>
        </div>
      </nav>

      {/* DESKTOP SPLINE HERO */}

      <section className="relative hidden min-h-screen items-center justify-center overflow-hidden bg-black px-5 pt-20 sm:px-6 lg:flex">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Spline
            scene="https://prod.spline.design/t4kDbSZWSwl-hZS4/scene.splinecode"
            className="h-full w-full scale-[1.08]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-xs text-gray-500/80">
          <span className="inline-flex items-center gap-3 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-xs tracking-[0.12em] text-cyan-100/70 backdrop-blur-md">
            <motion.span
              animate={{ y: [0, 5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-cyan-300"
            >
              ↓
            </motion.span>
            SCROLL TO ENTER NEXORA
            <motion.span
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]"
            />
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
      </section>

      {/* HERO */}


      <section className="relative flex min-h-[calc(100svh-84px)] items-center overflow-hidden bg-black px-5 pb-10 pt-28 sm:px-6 lg:min-h-screen lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black to-transparent" />
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-0 opacity-[0.045]"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 20%, black 75%, transparent)",
            }}
          />
        </motion.div>

        <motion.div
          style={{ y: glowY }}
          className="absolute left-1/2 top-[45%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/12 blur-[170px] lg:h-[1000px] lg:w-[1000px]"
        />

        <div className="absolute left-[8%] top-[22%] hidden h-40 w-40 rounded-full border border-cyan-400/10 bg-cyan-400/5 blur-sm lg:block" />
        <div className="absolute bottom-[12%] right-[8%] hidden h-56 w-56 rounded-full border border-violet-400/10 bg-violet-500/5 blur-sm lg:block" />

        <RoboticArm side="left" />
        <RoboticArm side="right" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div style={{ y: heroY }} className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200 backdrop-blur-xl sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,1)]" />
              Your AI workforce is online
            </div>

            <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl md:text-7xl xl:text-[92px]">
              Stop managing
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                busywork.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-gray-300/80 sm:text-lg lg:mx-0 lg:text-xl">
              Deploy AI employees across admin, inbox, CRM, invoicing,
              lead follow-up and reporting. Nexora keeps work moving
              while your team stays in control.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                onClick={openDemo}
                className="rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 font-semibold shadow-[0_0_70px_rgba(59,130,246,0.4)] transition duration-300 hover:scale-105"
              >
                Build My AI Workforce
              </button>

              <a
                href="#platform"
                className="rounded-full border border-white/[0.08] bg-white/5 px-8 py-4 font-semibold text-gray-300 backdrop-blur-xl transition hover:border-cyan-400/20 hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs text-gray-500/80 lg:justify-start sm:text-sm">
              <span>✓ CRM automation</span>
              <span>✓ Inbox intelligence</span>
              <span>✓ Finance workflows</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[620px]"
          >
            <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="relative rounded-[32px] border border-cyan-400/20 bg-black/55 p-4 shadow-[0_0_120px_rgba(34,211,238,0.16)] backdrop-blur-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-xs text-gray-500/80">Nexora OS</p>
                  <p className="font-bold">AI Workforce Command</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  ● 6 AI employees active
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["INBOX AI", "14 emails processed", "Drafting replies"],
                  ["CRM AI", "3 leads updated", "Pipeline moving"],
                  ["FINANCE AI", "2 invoices prepared", "Awaiting approval"],
                  ["ADMIN AI", "8 tasks completed", "Next task running"],
                ].map(([name, metric, status], index) => (
                  <motion.div
                    key={name}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3.5 + index * 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs tracking-[0.16em] text-cyan-300">
                        {name}
                      </span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                    </div>
                    <p className="mt-4 font-semibold">{metric}</p>
                    <p className="mt-1 text-xs text-gray-500/80">{status}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xl font-black text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.3)]"
                  >
                    N
                  </motion.div>
                  <div className="min-w-0">
                    <p className="font-semibold">Nexora Core is coordinating work</p>
                    <p className="mt-1 text-xs text-gray-500/80">
                      Routing tasks between AI employees and approval queues
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-20 hidden rounded-2xl border border-cyan-400/20 bg-black/65 p-3 shadow-xl backdrop-blur-xl sm:block"
            >
              <p className="text-xs text-gray-500/80">NEW LEAD</p>
              <p className="mt-1 text-sm font-semibold text-cyan-200">CRM updated ✓</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-violet-400/20 bg-black/65 p-3 shadow-xl backdrop-blur-xl sm:block"
            >
              <p className="text-xs text-gray-500/80">APPROVAL READY</p>
              <p className="mt-1 text-sm font-semibold text-violet-200">Invoice prepared</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}

      <section
        id="platform"
        className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-6 lg:min-h-[72vh] lg:py-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
            backgroundSize: "76px 76px",
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 hidden h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/10 lg:block"
        />

        <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[180px]" />

        <motion.div
          animate={{ y: [0, -14, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-[24%] hidden rounded-2xl border border-red-400/15 bg-red-500/[0.055] p-4 backdrop-blur-xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-red-300/80">
            Inbox overload
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            47 unread emails
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 16, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-[22%] hidden rounded-2xl border border-orange-400/15 bg-orange-500/[0.055] p-4 backdrop-blur-xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-orange-300/80">
            CRM delay
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            Lead not followed up
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[18%] left-[14%] hidden rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.045] p-4 backdrop-blur-xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
            Manual admin
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            12 tasks waiting
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[17%] right-[15%] hidden rounded-2xl border border-violet-400/15 bg-violet-500/[0.055] p-4 backdrop-blur-xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-violet-300/80">
            Report missing
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            No clear view
          </p>
        </motion.div>

        <div className="relative z-10 max-w-6xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
            The Problem
          </p>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
            Your team is trapped
            <br />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
              in busywork.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-gray-300/80 sm:text-lg md:text-xl">
            Emails, admin, finance tasks, lead updates and reports keep
            pulling people away from the work that actually grows the
            business.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["47", "emails waiting"],
              ["12", "admin tasks"],
              ["3", "missed follow-ups"],
              ["0", "clear reports"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-black text-cyan-300">{number}</p>
                <p className="mt-2 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC WORKFLOW */}

      <section className="machine-section relative overflow-hidden px-5 py-10 sm:px-6 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#040713] to-black" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #67e8f9 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 hidden h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/10 lg:block"
        />

        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              How Nexora Works
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">
              Work enters.
              <br />
              Nexora coordinates.
              <br />
              Your team approves.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300/80 sm:text-lg">
              The future is not a chatbot answering random questions. It is a
              coordinated AI operating system that receives work, understands it,
              routes it and prepares the next action.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Signal received",
                  text: "A lead, email, invoice request or admin task enters the business.",
                },
                {
                  step: "02",
                  title: "AI employee selected",
                  text: "Nexora identifies whether CRM, Inbox, Finance, Admin or Reporting AI should act.",
                },
                {
                  step: "03",
                  title: "Action prepared",
                  text: "The right record, reply, opportunity, task or report is prepared automatically.",
                },
                {
                  step: "04",
                  title: "Human approval",
                  text: "Important actions can be reviewed before Nexora completes the workflow.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="machine-step rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-5 opacity-100 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300/80">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mx-auto min-h-[560px] w-full max-w-[680px] rounded-[40px] border border-cyan-400/20 bg-black/55 p-5 shadow-[0_0_130px_rgba(34,211,238,0.16)] backdrop-blur-2xl sm:p-8">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-violet-500/[0.08]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                  <div>
                    <p className="text-xs text-gray-500/80">Live workflow</p>
                    <h3 className="text-xl font-black sm:text-2xl">
                      Nexora Command Core
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                    ● Processing
                  </span>
                </div>

                <div className="relative mt-10 flex min-h-[410px] items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute z-20 flex h-40 w-40 items-center justify-center rounded-full border border-cyan-400/40 bg-black/70 shadow-[0_0_90px_rgba(34,211,238,0.35)]"
                  >
                    <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
                    <div className="text-center">
                      <p className="text-5xl font-black text-cyan-300">N</p>
                      <p className="mt-1 text-[10px] tracking-[0.24em] text-cyan-300">
                        CORE
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute h-72 w-72 rounded-full border border-dashed border-cyan-400/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute h-96 w-96 rounded-full border border-dashed border-violet-400/15"
                  />

                  {[
                    ["top-0 left-0", "Lead captured", "CRM AI"],
                    ["top-0 right-0", "Reply drafted", "Inbox AI"],
                    ["bottom-0 left-0", "Invoice prepared", "Finance AI"],
                    ["bottom-0 right-0", "Task created", "Admin AI"],
                  ].map(([position, title, label], index) => (
                    <motion.div
                      key={title}
                      animate={{
                        y: [0, index % 2 === 0 ? -8 : 8, 0],
                        opacity: [0.82, 1, 0.82],
                      }}
                      transition={{
                        duration: 3.2 + index * 0.35,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`absolute ${position} w-[145px] rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl sm:w-[170px]`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-semibold">{title}</p>
                      <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500" />
                    </motion.div>
                  ))}

                  <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent sm:block" />
                  <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent sm:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTOMATE FIRST */}

      <section className="relative overflow-hidden bg-black px-5 py-12 sm:px-6 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.10),transparent_34%),radial-gradient(circle_at_72%_55%,rgba(168,85,247,0.09),transparent_28%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300"
            >
              Start with the work slowing you down
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.08 }}
              className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              What Nexora can
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                automate first.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
            >
              Start with one workflow or connect the full operation. Nexora handles repetitive work while your team keeps approval and control.
            </motion.p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                code: "01",
                title: "Lead follow-up",
                text: "Capture enquiries, qualify intent and keep opportunities moving without leads going cold.",
                signal: "LEAD → QUALIFY → FOLLOW UP",
                glow: "from-cyan-400/20 to-blue-500/5",
              },
              {
                code: "02",
                title: "Inbox intelligence",
                text: "Read incoming emails, understand context, draft replies and route messages to the right person.",
                signal: "READ → UNDERSTAND → RESPOND",
                glow: "from-blue-400/20 to-violet-500/5",
              },
              {
                code: "03",
                title: "CRM updates",
                text: "Keep contacts, notes, stages and next actions current without manual data entry.",
                signal: "CAPTURE → UPDATE → PROGRESS",
                glow: "from-violet-400/20 to-fuchsia-500/5",
              },
              {
                code: "04",
                title: "Invoice admin",
                text: "Prepare routine finance actions, organise invoice information and surface items that need approval.",
                signal: "CHECK → PREPARE → APPROVE",
                glow: "from-fuchsia-400/20 to-violet-500/5",
              },
              {
                code: "05",
                title: "Task routing",
                text: "Turn requests into clear actions, assign ownership and keep work moving between teams.",
                signal: "REQUEST → ROUTE → COMPLETE",
                glow: "from-cyan-400/20 to-violet-500/5",
              },
              {
                code: "06",
                title: "Weekly reporting",
                text: "Pull operational activity into clear summaries so leaders can see what changed and what needs attention.",
                signal: "COLLECT → ANALYSE → REPORT",
                glow: "from-blue-400/20 to-cyan-500/5",
              },
            ].map((item, index) => (
              <motion.article
                key={item.code}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="absolute right-5 top-5 text-5xl font-black text-white/[0.035]">
                  {item.code}
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-xs font-bold text-cyan-200">
                      {item.code}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/30 to-transparent" />
                    <motion.span
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 2 + index * 0.18, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.85)]"
                    />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400 sm:text-[15px]">
                    {item.text}
                  </p>

                  <div className="mt-7 overflow-hidden rounded-xl border border-white/[0.06] bg-black/35 px-3 py-3">
                    <motion.div
                      animate={{ x: ["-3%", "3%", "-3%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="whitespace-nowrap text-[10px] font-semibold tracking-[0.14em] text-cyan-200/65"
                    >
                      {item.signal}
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[26px] border border-cyan-300/10 bg-gradient-to-r from-cyan-400/[0.055] via-white/[0.025] to-violet-500/[0.055] p-6 sm:flex-row sm:px-8"
          >
            <div>
              <p className="text-lg font-bold text-white">Not sure where to start?</p>
              <p className="mt-1 text-sm text-gray-400">
                We map the repetitive work first, then build the right AI workflow around it.
              </p>
            </div>
            <button
              onClick={openDemo}
              className="group relative shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative">Request a Demo →</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}

      <section
        id="ai"
        className="employee-grid relative overflow-hidden px-5 py-16 sm:px-6 sm:py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#040713] to-black" />
        <div className="absolute left-[-250px] top-20 h-[600px] w-[600px] rounded-full bg-violet-600/8 blur-[180px]" />
        <div className="absolute right-[-250px] bottom-10 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[180px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Product Modules
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              One AI workforce.
              <br />
              Multiple business functions.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300/80 sm:text-lg">
              Nexora is not one chatbot. It is a coordinated operating layer
              where each AI employee handles a specific part of your business.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-16 lg:grid-cols-3">
            {[
              {
                title: "CRM AI",
                eyebrow: "Sales pipeline",
                description:
                  "Captures new enquiries, creates contacts, opens opportunities and schedules follow-ups automatically.",
                items: ["Lead created", "Opportunity opened", "Follow-up task due tomorrow"],
              },
              {
                title: "Inbox AI",
                eyebrow: "Email operations",
                description:
                  "Reads incoming emails, understands intent, drafts replies and flags anything urgent for approval.",
                items: ["Email analysed", "Reply drafted", "Urgency detected"],
              },
              {
                title: "Finance AI",
                eyebrow: "Invoices & billing",
                description:
                  "Prepares invoice tasks, checks billing details and keeps payment-related admin moving.",
                items: ["Invoice prepared", "Billing details checked", "Payment task logged"],
              },
              {
                title: "Admin AI",
                eyebrow: "Daily operations",
                description:
                  "Turns loose requests into tasks, reminders, internal notes and clean operational follow-through.",
                items: ["Task created", "Reminder scheduled", "Record updated"],
              },
              {
                title: "Reporting AI",
                eyebrow: "Performance visibility",
                description:
                  "Summarises business activity, highlights risks and gives your team clear next actions.",
                items: ["Report generated", "Risk highlighted", "Actions recommended"],
              },
              {
                title: "Workflow AI",
                eyebrow: "Process automation",
                description:
                  "Connects the dots between inbox, CRM, finance, tasks and approval queues.",
                items: ["Workflow triggered", "System updated", "Approval requested"],
              },
            ].map((module) => (
              <div
                key={module.title}
                className="mobile-force-visible reveal-card group relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-6 opacity-100 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
              >
                <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-cyan-400/10 blur-[70px] transition group-hover:bg-cyan-400/20" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-black shadow-[0_0_35px_rgba(59,130,246,0.25)]">
                      ✦
                    </div>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-400">
                    {module.eyebrow}
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    {module.title}
                  </h3>

                  <p className="mt-4 min-h-[88px] leading-relaxed text-gray-300/80">
                    {module.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {module.items.map((item, itemIndex) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/[0.08] bg-black/20 p-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-300">
                            {item}
                          </span>
                          <span className="text-xs text-cyan-300">
                            0{itemIndex + 1}
                          </span>
                        </div>
                        <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[36px] border border-cyan-400/20 bg-black/55 p-5 shadow-[0_0_120px_rgba(34,211,238,0.14)] backdrop-blur-2xl sm:mt-16 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                  Live Workflow Example
                </p>

                <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                  A lead comes in.
                  <br />
                  Nexora moves it through the business.
                </h3>

                <p className="mt-5 text-gray-300/80">
                  Your website already does this now: it captures the lead,
                  creates the CRM record, opens the opportunity, creates the
                  follow-up task and sends a notification.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Website lead captured"],
                  ["02", "CRM contact created"],
                  ["03", "Opportunity opened"],
                  ["04", "Follow-up task created"],
                ].map(([number, text]) => (
                  <div
                    key={text}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
                  >
                    <span className="text-sm text-cyan-300">{number}</span>
                    <p className="mt-3 font-semibold">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL CENTRE */}

      <section className="relative flex min-h-[auto] items-center justify-center px-5 py-12 sm:px-6 lg:min-h-screen lg:py-24">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[180px] sm:h-[800px] sm:w-[800px]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Control Centre
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Humans approve.
              <br />
              AI executes.
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray-300/80 sm:text-lg">
              Nexora prepares actions, drafts replies, updates systems
              and keeps important decisions inside an approval queue.
            </p>
          </div>

          <div className="w-full rounded-[28px] border border-cyan-400/20 bg-black/60 p-5 shadow-[0_0_120px_rgba(34,211,238,0.18)] backdrop-blur-2xl sm:rounded-[36px] sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <p className="text-xs text-gray-500/80 sm:text-sm">
                  Nexora Workspace
                </p>

                <h3 className="text-xl font-bold sm:text-2xl">
                  AI Command Panel
                </h3>
              </div>

              <span className="rounded-full bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300 sm:px-4 sm:text-sm">
                Live
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Customer reply drafted",
                "New lead added to CRM",
                "Invoice prepared",
                "Follow-up task scheduled",
                "Weekly report generated",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm sm:text-base">
                      {item}
                    </p>

                    <span className="text-sm text-cyan-300">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / TRUST */}

      <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#040713] to-black" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Built for operators
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              Replace scattered admin with one AI operating layer.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300/80 sm:text-lg">
              Nexora is designed for service businesses, agencies, property teams,
              sales teams and growing SMEs that need work captured, routed,
              followed up and reported properly.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Starter",
                price: "AI lead capture",
                text: "Best for proving Nexora on your website and CRM workflow.",
                points: ["Website demo form", "CRM contact creation", "Opportunity creation", "Email notification"],
              },
              {
                title: "Growth",
                price: "AI operations layer",
                text: "For teams that want inbox, CRM, admin and reporting connected.",
                points: ["Inbox assistant", "CRM employee", "Follow-up tasks", "Approval queue"],
                featured: true,
              },
              {
                title: "Enterprise",
                price: "Custom AI workforce",
                text: "For businesses that need deeper integrations and custom workflows.",
                points: ["Custom workflows", "Finance automations", "Reporting engine", "Multi-team setup"],
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`relative overflow-hidden rounded-[34px] border p-7 backdrop-blur-xl ${
                  plan.featured
                    ? "border-cyan-400/30 bg-cyan-400/[0.08] shadow-[0_0_90px_rgba(34,211,238,0.16)]"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300">
                    Recommended
                  </div>
                )}

                <p className="text-2xl font-black">{plan.title}</p>
                <p className="mt-3 text-lg font-semibold text-cyan-300">{plan.price}</p>
                <p className="mt-4 min-h-[72px] text-gray-300/80">{plan.text}</p>

                <div className="mt-7 space-y-3">
                  {plan.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-300">
                        ✓
                      </span>
                      {point}
                    </div>
                  ))}
                </div>

                <button
                  onClick={openDemo}
                  className={`mt-8 w-full rounded-2xl px-5 py-4 font-semibold transition hover:scale-[1.01] ${
                    plan.featured
                      ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-[0_0_50px_rgba(59,130,246,0.25)]"
                      : "border border-white/[0.08] bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Discuss {plan.title}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 text-center sm:grid-cols-3">
            {[
              ["Secure", "Server-side lead workflow with RLS enabled."],
              ["Fast", "New leads become CRM opportunities instantly."],
              ["Practical", "Built around real business admin, not gimmicks."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <p className="font-bold text-cyan-300">{title}</p>
                <p className="mt-2 text-sm text-gray-500/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-32">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[180px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Questions
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              What businesses want to know.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2">
            {[
              [
                "Will Nexora replace my staff?",
                "Nexora is designed to remove repetitive operational work from your team. People stay focused on judgement, relationships and growth while AI handles repeatable admin.",
              ],
              [
                "Can humans approve actions first?",
                "Yes. Important actions can be routed into an approval queue so your team reviews them before Nexora executes.",
              ],
              [
                "Can it connect to our existing systems?",
                "The platform is being built around integrations with inboxes, CRM systems, finance tools and internal workflows. The exact setup depends on your current stack.",
              ],
              [
                "Is our business data secure?",
                "The architecture keeps sensitive workflow logic server-side, uses controlled database access and is designed around tenant separation as the platform expands.",
              ],
              [
                "What can we automate first?",
                "Start with a painful, repetitive workflow: lead capture, inbox triage, CRM updates, follow-ups, invoicing admin or recurring reports.",
              ],
              [
                "How quickly can we see value?",
                "A focused first workflow can show value quickly because the goal is not to automate everything at once. It is to remove one expensive bottleneck, then expand.",
              ],
            ].map(([question, answer]) => (
              <div
                key={question}
                className="mobile-force-visible rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 opacity-100 backdrop-blur-xl transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                    ?
                  </span>
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{question}</h3>
                    <p className="mt-3 leading-relaxed text-gray-300/80">{answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA / ENQUIRY FORM */}

      <section
        id="demo"
        className="scroll-mt-24 relative overflow-hidden px-5 py-12 sm:px-6 lg:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-black" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-4xl font-black text-cyan-300 shadow-[0_0_70px_rgba(34,211,238,0.25)]">
              N
            </div>

            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Start with one workflow
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
              Build your first
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                AI employee.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300/80 sm:text-lg">
              Show us where your team is losing time. We will map the workflow,
              identify the automation opportunity and show you what Nexora could do.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["CRM", "Inbox", "Finance"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-gray-300"
                >
                  <span className="text-cyan-300">✓</span> {item} workflows
                </div>
              ))}
            </div>
          </div>

          <div
            id="demo-form"
            className="relative z-[30] scroll-mt-28 rounded-[32px] border border-cyan-400/20 bg-black/60 p-5 shadow-[0_0_120px_rgba(34,211,238,0.14)] backdrop-blur-2xl sm:p-8"
          >
            {!submitted ? (
              <>
                <div className="mb-7">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                    Request a Demo
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                    Tell us what to automate.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    This form submits directly into your Nexora lead workflow.
                  </p>
                </div>

                <form action="/api/lead" method="POST" className="relative z-[40] space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="page-name" className="mb-2 block text-sm text-gray-400">
                        Your name
                      </label>
                      <input
                        id="page-name"
                        name="name"
                        required
                        type="text"
                        placeholder="John Smith"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>

                    <div>
                      <label htmlFor="page-company" className="mb-2 block text-sm text-gray-400">
                        Company
                      </label>
                      <input
                        id="page-company"
                        name="company"
                        required
                        type="text"
                        placeholder="Your company"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="page-email" className="mb-2 block text-sm text-gray-400">
                        Work email
                      </label>
                      <input
                        id="page-email"
                        name="email"
                        required
                        type="email"
                        placeholder="you@company.com"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>

                    <div>
                      <label htmlFor="page-phone" className="mb-2 block text-sm text-gray-400">
                        Phone number
                      </label>
                      <input
                        id="page-phone"
                        name="phone"
                        type="tel"
                        placeholder="+44"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="page-automation-request" className="mb-2 block text-sm text-gray-400">
                      What would you like Nexora to automate?
                    </label>
                    <textarea
                      id="page-automation-request"
                      name="automation_request"
                      required
                      rows={4}
                      placeholder="Customer emails, lead follow-ups, CRM updates, invoicing, admin tasks..."
                      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                    />
                  </div>

                  {formError && (
                    <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="relative z-[40] w-full touch-manipulation rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-4 font-semibold shadow-[0_0_50px_rgba(59,130,246,0.25)] transition hover:scale-[1.01]"
                  >
                    Submit Enquiry
                  </button>

                  <p className="text-center text-xs text-gray-600">
                    No spam. We&apos;ll only contact you about your Nexora demo.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 14,
                  }}
                  className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-4xl text-cyan-300 shadow-[0_0_70px_rgba(34,211,238,0.25)]"
                >
                  ✓
                </motion.div>

                <h3 className="mt-8 text-3xl font-black sm:text-5xl">
                  Request received.
                </h3>

                <p className="mt-5 max-w-md leading-relaxed text-gray-400">
                  Your details have been received. The Nexora team will
                  review your automation requirements and get in touch.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/[0.06] bg-black px-5 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_0.6fr_0.6fr]">
          <div>
            <p className="text-2xl font-black tracking-tight">NEXORA</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              AI employees for business operations. Built to handle repetitive
              work across inbox, CRM, finance, admin, reporting and workflows.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Platform</p>
            <div className="mt-4 space-y-3 text-sm text-gray-500/80">
              <a href="#platform" className="block transition hover:text-cyan-300">How it works</a>
              <a href="#ai" className="block transition hover:text-cyan-300">AI workforce</a>
              <button onClick={openDemo} className="block transition hover:text-cyan-300">Request demo</button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Nexora</p>
            <div className="mt-4 space-y-3 text-sm text-gray-500/80">
              <p>CRM AI</p>
              <p>Inbox AI</p>
              <p>Workflow AI</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-center text-xs text-gray-600 sm:flex-row sm:text-left">
          <p>© 2026 Nexora. All rights reserved.</p>
          <p>AI workforce infrastructure for modern business.</p>
        </div>
      </footer>

      {/* DEMO MODAL */}

      {demoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#02030a]/90 px-4 py-8 backdrop-blur-xl">
          <button
            aria-label="Close modal background"
            onClick={closeDemo}
            className="absolute inset-0 cursor-default"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#071027] shadow-[0_0_120px_rgba(34,211,238,0.18)]"
          >
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px]" />

            <button
              type="button"
              onClick={closeDemo}
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/5 text-xl text-gray-300/80 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>

            {!submitted ? (
              <div className="relative z-10 p-6 sm:p-10">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                    Request a Demo
                  </p>

                  <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                    Build your

                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                      {" "}
                      AI workforce.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300/80 sm:text-base">
                    Tell us where your business is losing time.
                    We&apos;ll show you how Nexora can automate the
                    repetitive work around your team.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm text-gray-300/80"
                      >
                        Your name
                      </label>

                      <input
                        id="name"
                        name="name"
                        required
                        type="text"
                        placeholder="John Smith"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-sm text-gray-300/80"
                      >
                        Company
                      </label>

                      <input
                        id="company"
                        name="company"
                        required
                        type="text"
                        placeholder="Your company"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-gray-300/80"
                      >
                        Work email
                      </label>

                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        placeholder="you@company.com"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm text-gray-300/80"
                      >
                        Phone number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+44"
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="automation_request"
                      className="mb-2 block text-sm text-gray-300/80"
                    >
                      What would you like Nexora to automate?
                    </label>

                    <textarea
                      id="automation_request"
                      name="automation_request"
                      required
                      rows={4}
                      placeholder="Customer emails, lead follow-ups, CRM updates, invoicing, admin tasks..."
                      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                    />
                  </div>

                  {formError && (
                    <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-4 font-semibold shadow-[0_0_50px_rgba(59,130,246,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Sending..."
                      : "Request My Demo"}
                  </button>

                  <p className="text-center text-xs text-gray-600">
                    No spam. We&apos;ll only contact you about your
                    Nexora demo.
                  </p>
                </form>
              </div>
            ) : (
              <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center p-8 text-center sm:p-12">
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 14,
                  }}
                  className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-4xl text-cyan-300 shadow-[0_0_70px_rgba(34,211,238,0.25)]"
                >
                  ✓
                </motion.div>

                <h2 className="mt-8 text-3xl font-black sm:text-5xl">
                  Request received.
                </h2>

                <p className="mt-5 max-w-md leading-relaxed text-gray-300/80">
                  Your details have been received. The Nexora team will
                  review your automation requirements and get in touch.
                </p>

                <button
                  type="button"
                  onClick={closeDemo}
                  className="mt-8 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-7 py-3 text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  Return to Nexora
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}


function SplineHeroFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-[0.075]"
        style={{
          backgroundImage:
            "linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div
        className="absolute left-1/2 top-[48%] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-[120px]"
        style={{ animation: "mobileGlow 5s ease-in-out infinite" }}
      />

      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/70 to-transparent" />

      <div
        className="absolute left-[-25%] top-[52%] h-[86px] w-[150%] rounded-[50%] bg-gradient-to-r from-violet-500/45 via-cyan-300/70 to-violet-500/40 blur-[14px]"
        style={{ animation: "mobileWaveA 6s ease-in-out infinite" }}
      />
      <div
        className="absolute left-[-20%] top-[58%] h-[54px] w-[145%] rounded-[50%] bg-gradient-to-r from-blue-500/25 via-white/55 to-fuchsia-500/30 blur-[10px]"
        style={{ animation: "mobileWaveB 7.5s ease-in-out infinite" }}
      />
      <div
        className="absolute left-[-18%] top-[64%] h-[38px] w-[138%] rounded-[50%] bg-gradient-to-r from-cyan-400/20 via-violet-400/38 to-cyan-400/18 blur-xl"
        style={{ animation: "mobileWaveA 9s ease-in-out infinite reverse" }}
      />

      <div className="absolute inset-x-0 top-[16%] z-10 px-5 text-center">
        <h1 className="text-[39px] font-light leading-[1.08] tracking-[-0.05em] text-white">
          Your Business.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-400 bg-clip-text text-transparent">
            Running Smarter.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-[330px] text-sm leading-relaxed text-gray-300/75">
          AI employees for admin, inbox, CRM, invoicing, reporting and workflows.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent" />
    </div>
  );
}

function RobotFigure({
  label,
}: {
  label: string;
}) {
  return (
    <div className="relative h-64 w-44 opacity-70">
      <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-[28px] border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-xl">
        <div className="mt-7 flex justify-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
        </div>
      </div>

      <div className="absolute left-1/2 top-24 h-28 w-32 -translate-x-1/2 rounded-[32px] border border-blue-400/20 bg-blue-500/10 backdrop-blur-xl">
        <p className="mt-10 text-center text-xs tracking-[0.25em] text-cyan-300">
          {label}
        </p>
      </div>

      <div className="absolute left-0 top-32 h-3 w-16 rotate-[-25deg] rounded-full bg-cyan-400/30" />

      <div className="absolute right-0 top-32 h-3 w-16 rotate-[25deg] rounded-full bg-violet-400/30" />
    </div>
  );
}

function RoboticArm({
  side,
}: {
  side: "left" | "right";
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      animate={{
        rotate: isLeft
          ? [-4, 4, -4]
          : [4, -4, 4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute top-[62%] hidden h-40 w-72 lg:block ${
        isLeft
          ? "left-[-70px]"
          : "right-[-70px] scale-x-[-1]"
      }`}
    >
      <div className="absolute left-0 top-16 h-8 w-36 rounded-full border border-cyan-400/20 bg-cyan-400/10" />

      <div className="absolute left-32 top-10 h-8 w-32 rotate-[-28deg] rounded-full border border-violet-400/20 bg-violet-400/10" />

      <div className="absolute left-56 top-0 h-16 w-16 rounded-2xl border border-cyan-400/30 bg-[#08122b]" />
    </motion.div>
  );
}