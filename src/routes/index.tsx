import { createFileRoute } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
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
} from "lucide-react";
import { Toaster } from "sonner";
import { VideoPlayer } from "@/components/VideoPlayer";
import { RegistrationForm } from "@/components/RegistrationForm";
import logoImg from "@/assets/medebir-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medebir Sales Agents — Join the Future of Ethiopian Retail" },
      {
        name: "description",
        content:
          "Become a Medebir sales agent. Smart inventory, QR / barcode scanning, multi-branch, analytics — built for Ethiopian retail. Register today.",
      },
      { property: "og:title", content: "Medebir Sales Agents — Join the Future of Ethiopian Retail" },
      {
        property: "og:description",
        content:
          "Become a Medebir sales agent. Smart inventory, QR / barcode scanning, multi-branch, analytics — built for Ethiopian retail.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const features = [
  {
    icon: Package,
    title: "Smart Inventory",
    desc: "Track products with real-time quantities, low-stock alerts, and Ethiopian date tracking.",
  },
  {
    icon: QrCode,
    title: "QR / Barcod Scanning",
    desc: "Generate QR codes for every item. Scan instantly on any device to process sales in under a second.",
  },
  {
    icon: Building2,
    title: "Multi-Branch",
    desc: "Manage unlimited branches, transfer stock, and track performance per location.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    desc: "Revenue charts in Amharic months, fast-moving products, financial summaries, and date filters.",
  },
  {
    icon: Users,
    title: "Team & Roles",
    desc: "Owner, Admin, and Salesperson roles with granular permission control.",
  },
  {
    icon: Shield,
    title: "Full Audit Trail",
    desc: "Every sale and transfer logged. Filter by date, category, payment type, or status.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Logo({ size = 40 }: { size?: number }) {
  return (
    <a
      href="https://medebir.business"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3"
      aria-label="Visit Medebir"
    >
      <span
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-white to-secondary shadow-card ring-1 ring-border transition-all duration-500 group-hover:shadow-glow group-hover:-translate-y-0.5"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={logoImg}
          alt="Medebir"
          className="relative h-[72%] w-[72%] object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-primary">
        Medebir
      </span>
    </a>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Toaster theme="light" position="top-center" richColors />

      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-[10%] -left-32 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl animate-blob" />
        <div
          className="absolute top-[40%] -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-blob"
          style={{ animationDelay: "6s" }}
        />
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
            <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Contact</a>
          </nav>
          <a
            href="#register"
            className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:bg-accent hover:shadow-glow"
          >
            Join Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="relative px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Now hiring sales agents across Ethiopia
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl lg:text-[5.25rem]"
          >
            Join the future of
            <br />
            <span className="text-gradient">Ethiopian retail</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Help Ethiopian shops modernize with Medebir — the all-in-one inventory, sales,
            and analytics platform built for every neighborhood store.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              Become a Sales Agent
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#training"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-base font-semibold text-primary shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              Watch Training
            </a>
          </motion.div>

          {/* Hero video */}
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

      {/* FEATURES */}
      <section id="features" className="relative px-6 md:py-24 py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              What you'll sell
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Everything a modern shop needs,
              <span className="text-gradient-sky"> in one platform.</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
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

      {/* STATS */}
      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-primary p-8 shadow-glow md:grid-cols-4"
          >
            {[
              { v: "20+", l: "Shops Onboarded" },
              { v: "3+", l: "Cities Covered" },
              { v: "<1s", l: "Sale Processing" },
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

      {/* REGISTER */}
      <section id="register" className="relative px-6 md:py-24 py-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Apply now
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Start earning with <span className="text-gradient">Medebir.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Fill in your details — our team will reach out within 24 hours.
            </p>
          </motion.div>

          <div className="mt-12">
            <RegistrationForm />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative px-6 md:py-20 py-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 rounded-3xl bg-surface p-8 shadow-card ring-1 ring-border md:grid-cols-2 md:p-12"
          >
            <div>
              <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Let's talk.
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                Questions about becoming an agent? Reach out — we're happy to help.
              </p>
            </div>
            <div className="space-y-4">
              <a
                href="tel:+251913020845"
                className="group flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-all duration-300 hover:bg-secondary/70 hover:translate-x-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</div>
                  <div className="font-display text-lg font-semibold text-primary">0913 020 845</div>
                </div>
              </a>
              <a
                href="https://medebir.business"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-all duration-300 hover:bg-secondary/70 hover:translate-x-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Globe className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visit</div>
                  <div className="font-display text-lg font-semibold text-primary">medebir.business</div>
                </div>
              </a>
              <a
                href="mailto:info.medebir@gmail.com"
                className="group flex items-center gap-4 rounded-2xl bg-secondary p-4 transition-all duration-300 hover:bg-secondary/70 hover:translate-x-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
                  <div className="font-display text-lg font-semibold text-primary">info.medebir@gmail.com</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <Logo size={32} />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Medebir. Built for Ethiopian retail.
          </p>
        </div>
      </footer>
    </div>
  );
}
