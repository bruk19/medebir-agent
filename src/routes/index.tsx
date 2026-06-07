import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Package,
  QrCode,
  Building2,
  BarChart3,
  Users,
  Shield,
  Sparkles,
  Phone,
  Globe,
  Mail,
  ArrowRight,
  CheckCircle2,
  Shirt,
  Pill,
  Smartphone,
  Wrench,
} from "lucide-react";
import { Toaster } from "sonner";
import { VideoPlayer } from "@/components/VideoPlayer";
import { RegistrationForm } from "@/components/RegistrationForm";
import logoImg from "@/assets/medebir-logo.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShopType = {
  name: string;
  icon: typeof Shirt;
  awning: string;
  wall: string;
  sign: string;
};

type Phase = "walking" | "entering" | "registering" | "paying" | "exiting" | "celebrating";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SHOP_TYPES: ShopType[] = [
  { name: "Boutique",    icon: Shirt,      awning: "bg-pink-500",    wall: "bg-pink-50 dark:bg-pink-950/40",        sign: "text-pink-700 dark:text-pink-300" },
  { name: "Pharmacy",   icon: Pill,       awning: "bg-emerald-500", wall: "bg-emerald-50 dark:bg-emerald-950/40",  sign: "text-emerald-700 dark:text-emerald-300" },
  { name: "Electronics",icon: Smartphone, awning: "bg-sky-500",     wall: "bg-sky-50 dark:bg-sky-950/40",          sign: "text-sky-700 dark:text-sky-300" },
  { name: "Autospare",  icon: Wrench,     awning: "bg-amber-500",   wall: "bg-amber-50 dark:bg-amber-950/40",      sign: "text-amber-700 dark:text-amber-300" },
];

const features = [
  { icon: Package,   title: "Smart Inventory",  desc: "Track products with real-time quantities, low-stock alerts, and Ethiopian date tracking." },
  { icon: QrCode,    title: "QR / Barcode Scanning", desc: "Generate QR codes for every item. Scan instantly on any device to process sales in under a second." },
  { icon: Building2, title: "Multi-Branch",     desc: "Manage unlimited branches, transfer stock, and track performance per location." },
  { icon: BarChart3, title: "Rich Analytics",   desc: "Revenue charts in Amharic months, fast-moving products, financial summaries, and date filters." },
  { icon: Users,     title: "Team & Roles",     desc: "Owner, Admin, and Salesperson roles with granular permission control." },
  { icon: Shield,    title: "Full Audit Trail", desc: "Every sale and transfer logged. Filter by date, category, payment type, or status." },
];

const COMMISSION    = 500;
const MONTHLY_TOTAL = 45_000;

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── PersonAvatar ─────────────────────────────────────────────────────────────

function PersonAvatar({ gender }: { gender: "m" | "f" }) {
  const isF = gender === "f";
  return (
    <svg viewBox="0 0 40 56" className="h-14 w-10 drop-shadow-md sm:h-16 sm:w-12">
      <rect x="14" y="38" width="5"  height="14" rx="1.5" fill="#1f2937" />
      <rect x="21" y="38" width="5"  height="14" rx="1.5" fill="#1f2937" />
      <rect x="13" y="51" width="7"  height="3"  rx="1"   fill="#0f172a" />
      <rect x="20" y="51" width="7"  height="3"  rx="1"   fill="#0f172a" />
      <path d="M10 26 Q10 20 20 20 Q30 20 30 26 L31 40 L9 40 Z" fill={isF ? "#ec4899" : "#2563eb"} />
      <rect x="19" y="20" width="2"  height="10" fill="#facc15" />
      <rect x="17" y="29" width="6"  height="4"  rx="0.5" fill="#fff" stroke="#d1d5db" strokeWidth="0.5" />
      <rect x="17.5" y="16" width="5" height="5" fill="#d4a373" />
      <circle cx="20" cy="11" r="6" fill="#e0ac8b" />
      {isF ? (
        <>
          <path d="M14 9 Q14 3 20 3 Q26 3 26 9 L26 13 Q23 11 20 11 Q17 11 14 13 Z" fill="#3b2412" />
          <path d="M14 9 L13 18 L15 18 L16 11 Z" fill="#3b2412" />
          <path d="M26 9 L27 18 L25 18 L24 11 Z" fill="#3b2412" />
        </>
      ) : (
        <path d="M14 9 Q14 4 20 4 Q26 4 26 9 L26 10 Q23 8 20 8 Q17 8 14 10 Z" fill="#1f2937" />
      )}
      <circle cx="18" cy="11.5" r="0.7" fill="#0f172a" />
      <circle cx="22" cy="11.5" r="0.7" fill="#0f172a" />
      <path d="M18 13.5 Q20 15 22 13.5" stroke="#0f172a" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <rect x="28" y="26" width="3" height="9"  rx="1.2" fill={isF ? "#ec4899" : "#2563eb"} />
      <rect x="29" y="31" width="9" height="7"  rx="1"   fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
      <rect x="30" y="32" width="7" height="5"  rx="0.5" fill="#22d3ee" opacity="0.7" />
    </svg>
  );
}

// ─── BigShopCard ──────────────────────────────────────────────────────────────

function BigShopCard({
  shop,
  registered,
  scanning,
  agentInside,
  gender,
}: {
  shop: ShopType;
  registered: boolean;
  scanning: boolean;
  agentInside: boolean;
  gender: "m" | "f";
}) {
  const Icon = shop.icon;
  return (
    <div className={`relative flex h-44 w-56 flex-col items-center justify-end rounded-2xl border border-border ${shop.wall} pt-2 shadow-xl sm:h-52 sm:w-72`}>
      {/* Awning */}
      <div className={`absolute -top-3 left-1/2 h-4 w-[108%] -translate-x-1/2 overflow-hidden rounded-t-md ${shop.awning} shadow-sm`}>
        <div className="h-full w-full opacity-40" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0 10px, transparent 10px 20px)" }} />
      </div>

      {/* Sign */}
      <div className={`mb-2 flex items-center gap-1.5 rounded-md bg-background/85 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${shop.sign} sm:text-xs`}>
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.4} />
        {shop.name}
      </div>

      {/* Windows */}
      <div className="mx-2 mb-2 grid w-[calc(100%-1rem)] grid-cols-2 gap-2">
        {[0, 1].map((k) => (
          <div key={k} className="flex h-12 items-center justify-center rounded-md bg-background/70 ring-1 ring-border sm:h-16">
            <Icon className="h-5 w-5 text-foreground/70 sm:h-7 sm:w-7" strokeWidth={1.6} />
          </div>
        ))}
      </div>

      {/* Door */}
      <div className="relative mb-0 h-10 w-8 overflow-hidden rounded-t-md bg-foreground/80 ring-1 ring-border sm:h-12 sm:w-10">
        {agentInside && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 4, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            className="absolute inset-x-0 bottom-0 flex justify-center"
          >
            <div className="origin-bottom scale-[0.55]">
              <PersonAvatar gender={gender} />
            </div>
          </motion.div>
        )}
        <span className="absolute right-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-amber-300" />
      </div>

      {/* QR sticker */}
      <motion.div
        initial={{ y: -120, opacity: 0, rotate: -25 }}
        animate={registered ? { y: 0, opacity: 1, rotate: 0 } : { y: -120, opacity: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-md bg-background shadow-md ring-1 ring-border sm:h-12 sm:w-12"
      >
        <QrCode className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
      </motion.div>

      {/* Scanning beam */}
      {scanning && (
        <motion.div
          className="absolute inset-x-4 top-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_16px_4px_rgba(16,185,129,0.6)]"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, 90, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Registered check */}
      <motion.div
        initial={false}
        animate={registered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg sm:h-9 sm:w-9"
      >
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </motion.div>

      {/* Success glow ring */}
      {registered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          initial={{ boxShadow: "0 0 0 0 rgba(16,185,129,0.55)" }}
          animate={{ boxShadow: "0 0 0 18px rgba(16,185,129,0)" }}
          transition={{ duration: 1.1 }}
        />
      )}
    </div>
  );
}

// ─── AgentRegistersShops ──────────────────────────────────────────────────────

function AgentRegistersShops() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const [loop,      setLoop]      = useState(0);
  const [shopIdx,   setShopIdx]   = useState(0);
  const [phase,     setPhase]     = useState<Phase>("walking");
  const [count,     setCount]     = useState(0);
  const [earnings,  setEarnings]  = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  const gender: "m" | "f" = loop % 2 === 0 ? "m" : "f";
  const agentName = gender === "m" ? "Daniel" : "Hanna";

  const shops: ShopType[] = [
    SHOP_TYPES[loop       % SHOP_TYPES.length],
    SHOP_TYPES[(loop + 1) % SHOP_TYPES.length],
    SHOP_TYPES[(loop + 2) % SHOP_TYPES.length],
  ];

  const currentShop = shops[shopIdx];

  const agentVisible = phase !== "entering" && phase !== "registering" && phase !== "paying";
  const agentLeft    = phase === "exiting" ? "88%" : "12%";

  const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    const run = async () => {
      setCount(0);
      setEarnings(0);
      setShopIdx(0);

      for (let i = 0; i < 3; i++) {
        if (cancelled) return;
        setShopIdx(i);
        setPhase("walking");
        await wait(1400);

        if (cancelled) return;
        setPhase("entering");
        await wait(900);

        if (cancelled) return;
        setPhase("registering");
        await wait(1500);

        if (cancelled) return;
        setPhase("paying");
        setShowBurst(true);
        setCount((c) => c + 1);
        setEarnings((e) => e + COMMISSION);
        await wait(1300);
        setShowBurst(false);

        if (cancelled) return;
        setPhase("exiting");
        await wait(900);
      }

      if (cancelled) return;
      setPhase("celebrating");
      await wait(3600);
      if (!cancelled) setLoop((l) => l + 1);
    };

    run();
    return () => { cancelled = true; };
  }, [inView, loop]);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-sky-50/60 via-secondary/30 to-background p-4 shadow-xl sm:p-6 dark:from-sky-950/30"
    >
      {/* Sky decor */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24">
        <div className="absolute right-6 top-3 h-8 w-8 rounded-full bg-amber-300/70 blur-[1px]" />
        <div className="absolute left-10 top-5 h-5 w-16 rounded-full bg-white/80 blur-sm" />
        <div className="absolute left-28 top-3 h-4 w-12 rounded-full bg-white/70 blur-sm" />
      </div>

      {/* Status bar */}
      <div className="relative mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-[10px] font-semibold text-foreground/70 ring-1 ring-border backdrop-blur sm:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live · Agent {agentName} on the field
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary sm:text-xs">
            {count}/3 shops
          </div>
          <motion.div
            key={`e-${earnings}-${loop}`}
            initial={{ scale: 0.8, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 sm:text-xs"
          >
            {earnings.toLocaleString()} ETB
          </motion.div>
        </div>
      </div>

      {/* Street scene */}
      <div className="relative h-64 sm:h-80">
        {/* Sidewalk */}
        <div className="absolute bottom-10 left-0 right-0 h-3 bg-slate-300/70 dark:bg-slate-700/70" />
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-400/40 dark:bg-slate-800/60">
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-amber-300/50" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(253,224,71,0.6) 0 24px, transparent 24px 40px)" }} />
        </div>

        {/* Current shop centre stage */}
        <div className="absolute bottom-[3.25rem] left-1/2 -translate-x-1/2">
          <motion.div
            key={`shop-${loop}-${shopIdx}`}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
          >
            <BigShopCard
              shop={currentShop}
              registered={phase === "paying" || phase === "exiting"}
              scanning={phase === "registering"}
              agentInside={phase === "entering" || phase === "registering" || phase === "paying"}
              gender={gender}
            />
          </motion.div>
        </div>

        {/* Agent walking on sidewalk */}
        <motion.div
          className="absolute bottom-[3.25rem] -translate-x-1/2"
          animate={{ left: agentLeft, opacity: agentVisible ? 1 : 0 }}
          transition={{
            left:    { type: "tween", duration: 1.3, ease: "easeInOut" },
            opacity: { duration: 0.25 },
          }}
        >
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
            <PersonAvatar gender={gender} />
            <span className="mt-0.5 block rounded-sm bg-foreground/90 px-1.5 py-0.5 text-center text-[8px] font-bold uppercase tracking-wide text-background sm:text-[10px]">
              Agent · {agentName}
            </span>
          </motion.div>
        </motion.div>

        {/* Commission burst */}
        {showBurst && (
          <motion.div
            key={`burst-${loop}-${shopIdx}`}
            className="absolute left-1/2 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg sm:text-sm"
            style={{ bottom: "11rem", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -30, -60], scale: [0.6, 1.15, 1, 0.95] }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          >
            +{COMMISSION} ETB · Paid
          </motion.div>
        )}

        {/* Monthly celebration overlay */}
        {phase === "celebrating" && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/95 via-emerald-600/95 to-teal-700/95 p-4 text-center text-white backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            {/* Confetti */}
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-sm"
                style={{
                  left: `${(i * 53) % 100}%`,
                  top: "-5%",
                  backgroundColor: ["#fde68a","#fca5a5","#a7f3d0","#bfdbfe","#fbcfe8"][i % 5],
                }}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 320, opacity: [0, 1, 1, 0], rotate: 360 }}
                transition={{ duration: 2.4, delay: (i % 6) * 0.12, ease: "easeIn" }}
              />
            ))}
            <div className="relative">
              <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-sm"
              >
                🎉 Congratulations, {agentName}!
              </motion.div>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35, type: "spring", stiffness: 180, damping: 12 }}
                className="mt-2 text-3xl font-extrabold leading-none tracking-tight drop-shadow-lg sm:text-5xl"
              >
                {MONTHLY_TOTAL.toLocaleString()} ETB
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-1 text-sm font-semibold text-white/95 sm:text-base"
              >
                earned this month
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white/95 ring-1 ring-white/30 sm:text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                500 ETB / month · per registered shop
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground sm:text-xs">
        Sales agents earn{" "}
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">500 ETB / month</span>{" "}
        for every shop they onboard to Medebir.
      </p>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ size = 40 }: { size?: number }) {
  return (
    <a href="https://medebir.business" target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3" aria-label="Visit Medebir"
    >
      <span
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-white to-secondary shadow-card ring-1 ring-border transition-all duration-500 group-hover:shadow-glow group-hover:-translate-y-0.5"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img src={logoImg} alt="Medebir" className="relative h-[72%] w-[72%] object-contain transition-transform duration-500 group-hover:scale-110" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-primary">Medebir</span>
    </a>
  );
}

// ─── Route & Page ─────────────────────────────────────────────────────────────

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medebir Sales Agents — Join the Future of Ethiopian Retail" },
      { name: "description", content: "Become a Medebir sales agent. Smart inventory, QR / barcode scanning, multi-branch, analytics — built for Ethiopian retail. Register today." },
      { property: "og:title", content: "Medebir Sales Agents — Join the Future of Ethiopian Retail" },
      { property: "og:description", content: "Become a Medebir sales agent. Smart inventory, QR / barcode scanning, multi-branch, analytics — built for Ethiopian retail." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Toaster theme="light" position="top-center" richColors />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-[10%] -left-32 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl animate-blob" />
        <div className="absolute top-[40%] -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {/* Nav */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Logo size={44} />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Features</a>
            <a href="#training" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Training</a>
            <a href="#contact"  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Contact</a>
          </nav>
          <a href="#register" className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:bg-accent hover:shadow-glow">
            Join Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Now hiring sales agents across Ethiopia
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl lg:text-[5.25rem]"
          >
            Join the future of
            <br />
            <span className="text-gradient">Ethiopian retail</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Help Ethiopian shops modernize with Medebir — the all-in-one inventory, sales,
            and analytics platform built for every neighborhood store.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a href="#register" className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5">
              Become a Sales Agent
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#training" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-base font-semibold text-primary shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
              Watch Training
            </a>
          </motion.div>

          {/* Training video */}
          <motion.div
            id="training"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 md:mt-20"
          >
            <VideoPlayer />
            <p className="mt-5 text-sm text-muted-foreground">
              Sales agent orientation — learn how to onboard shops in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">What you'll sell</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Everything a modern shop needs,
              <span className="text-gradient-sky"> in one platform.</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} initial="hidden" whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group relative overflow-hidden rounded-2xl bg-surface p-7 shadow-card ring-1 ring-border transition-shadow duration-500 hover:shadow-soft"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/8 blur-2xl transition-all duration-500 group-hover:bg-accent/15" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-primary">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-primary p-8 shadow-glow md:grid-cols-4"
          >
            {[
              { v: "20+",  l: "Shops Onboarded" },
              { v: "3+",   l: "Cities Covered" },
              { v: "<1s",  l: "Sale Processing" },
              { v: "24/7", l: "Agent Support" },
            ].map((s) => (
              <div key={s.l} className="text-center text-primary-foreground">
                <div className="font-display text-3xl font-bold md:text-4xl">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider opacity-80">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agent demo */}
      <AgentRegistersShops />

      {/* Register */}
      <section id="register" className="relative px-6 py-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Apply now</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Start earning with <span className="text-gradient">Medebir.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Fill in your details — our team will reach out within 24 hours.</p>
          </motion.div>
          <div className="mt-12">
            <RegistrationForm />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative px-6 py-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid gap-6 rounded-3xl bg-surface p-8 shadow-card ring-1 ring-border md:grid-cols-2 md:p-12"
          >
            <div>
              <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Let's talk.</h3>
              <p className="mt-3 max-w-md text-muted-foreground">Questions about becoming an agent? Reach out — we're happy to help.</p>
            </div>
            <div className="space-y-4">
              {[
                { href: "tel:+251913020845",         Icon: Phone, label: "Phone", value: "0913 020 845" },
                { href: "https://medebir.business",  Icon: Globe, label: "Visit", value: "medebir.business", external: true },
                { href: "mailto:info.medebir@gmail.com", Icon: Mail, label: "Email", value: "info.medebir@gmail.com" },
              ].map(({ href, Icon, label, value, external }) => (
                <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-all duration-300 hover:bg-secondary/70 hover:translate-x-1"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
                    <div className="font-display text-lg font-semibold text-primary">{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <Logo size={32} />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Medebir. Built for Ethiopian retail.</p>
        </div>
      </footer>
    </div>
  );
}
