import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CheckCircle2, PartyPopper, X } from "lucide-react";
import { toast } from "sonner";


export function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(100);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    subcity: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.subcity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("Name", form.name);
      fd.append("Phone", form.phone);
      fd.append("City", form.city);
      fd.append("Subcity", form.subcity);
      fd.append("_subject", "New Medebir Sales Agent Registration");
      fd.append("_captcha", "false");
      fd.append("_template", "table");

      const res = await fetch("https://formsubmit.co/ajax/brukteshome21@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });

      if (!res.ok) throw new Error("Network error");
      setDone(true);
      setShowSuccess(true);
      setForm({ name: "", phone: "", city: "", subcity: "" });
    } catch {
      toast.error("Couldn't submit. Please try again or call 0913 020 845.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss success popup after 10s with a countdown bar
  useEffect(() => {
    if (!showSuccess) return;
    setProgress(100);
    const start = Date.now();
    const total = 10_000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(pct);
      if (elapsed >= total) {
        clearInterval(tick);
        setShowSuccess(false);
      }
    }, 60);
    return () => clearInterval(tick);
  }, [showSuccess]);


  const fields: { key: keyof typeof form; label: string; type?: string; placeholder: string }[] = [
    { key: "name", label: "Full Name", placeholder: "Abebe Kebede..." },
    { key: "phone", label: "Phone Number", type: "tel", placeholder: "09xx xxx xxx" },
    { key: "city", label: "City", placeholder: "Addis Ababa..." },
    { key: "subcity", label: "Subcity / Area", placeholder: "Bole..." },
  ];

  return (
    <>
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-2xl rounded-3xl bg-surface p-8 md:p-10 shadow-soft ring-1 ring-border"
      >

      <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          >
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {f.label}
            </label>
            <input
              type={f.type ?? "text"}
              value={form[f.key]}
              onChange={update(f.key)}
              placeholder={f.placeholder}
              required
              className="w-full rounded-xl border border-border bg-input px-4 py-3.5 text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15"
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={loading || done}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : done ? (
          <>
            <CheckCircle2 className="h-5 w-5" /> Registration Received
          </>
        ) : (
          <>
            Become a Sales Agent
            <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </motion.button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By submitting, you agree to be contacted by the Medebir team.
        </p>
      </motion.form>

      {/* Success popup — auto-dismisses after 10s */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4 backdrop-blur-md"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-glow ring-1 ring-border"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Gradient hero */}
              <div className="relative overflow-hidden bg-gradient-primary px-8 pt-10 pb-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/25 backdrop-blur"
                >
                  <CheckCircle2 className="h-11 w-11 text-white" strokeWidth={2.4} />
                </motion.div>
                <PartyPopper className="pointer-events-none absolute left-6 top-6 h-6 w-6 rotate-[-20deg] text-white/70" />
                <PartyPopper className="pointer-events-none absolute right-6 top-10 h-5 w-5 rotate-[25deg] text-white/60" />
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-6 text-center">
                <h3 className="font-display text-2xl font-bold tracking-tight text-primary md:text-3xl">
                  You're in! 🎉
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Thanks for joining Medebir. Our team will reach out within
                  <span className="font-semibold text-primary"> 24 hours </span>
                  to get you started as a sales agent.
                </p>

                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:bg-accent hover:shadow-glow"
                >
                  Got it
                </button>
              </div>

              {/* Countdown progress bar */}
              <div className="h-1 w-full bg-secondary">
                <div
                  className="h-full bg-gradient-primary transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

