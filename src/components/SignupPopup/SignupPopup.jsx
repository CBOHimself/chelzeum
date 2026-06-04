import { useEffect, useMemo, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";

const DISMISS_KEY = "chelzeum-signup-dismissed";
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SIGNUP_API_URL = import.meta.env.VITE_SIGNUP_API_URL || "/api/subscribe";

function makeCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
}

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return desktop;
}

export default function SignupPopup() {
  const desktopLayout = useDesktopLayout();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", captcha: "" });
  const [captchaChallenge, setCaptchaChallenge] = useState(makeCaptcha);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const useTurnstile = Boolean(TURNSTILE_SITE_KEY);

  useEffect(() => {
    if (readDismissed()) return;
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const payload = useMemo(
    () => ({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      turnstileToken: useTurnstile ? turnstileToken : undefined,
      captchaA: useTurnstile ? undefined : captchaChallenge.a,
      captchaB: useTurnstile ? undefined : captchaChallenge.b,
      captchaAnswer: useTurnstile ? undefined : form.captcha,
    }),
    [form, turnstileToken, useTurnstile, captchaChallenge]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (useTurnstile && !turnstileToken) {
      setStatus({ type: "error", message: "Please complete the captcha." });
      return;
    }

    if (!useTurnstile && Number(form.captcha) !== captchaChallenge.answer) {
      setStatus({ type: "error", message: "Captcha is incorrect. Please try again." });
      setForm((prev) => ({ ...prev, captcha: "" }));
      setCaptchaChallenge(makeCaptcha());
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }
      setStatus({
        type: "success",
        message: "Thank you — you're on the list. We'll be in touch soon.",
      });
      setForm({ name: "", phone: "", email: "", captcha: "" });
      setTurnstileToken("");
      setCaptchaChallenge(makeCaptcha());
      window.setTimeout(dismiss, 2200);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="signup-popup-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            className="signup-popup"
            role="dialog"
            aria-labelledby="signup-popup-title"
            aria-modal="true"
            initial={
              desktopLayout
                ? { opacity: 0, x: 24, y: 24, scale: 0.98 }
                : { opacity: 0, y: 24, scale: 0.98 }
            }
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={
              desktopLayout
                ? { opacity: 0, x: 16, y: 16, scale: 0.98 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="signup-popup__close"
              onClick={dismiss}
              aria-label="Dismiss signup popup"
            >
              ✕
            </button>

            <p className="signup-popup__eyebrow">Stay in touch</p>
            <h2 id="signup-popup-title" className="signup-popup__title">
              Sign up to be the first to get updates
            </h2>

            <form className="signup-popup__form" onSubmit={handleSubmit}>
              <label className="events-form-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="events-form-field">
                <span>Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="events-form-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                  required
                />
              </label>

              {useTurnstile ? (
                <div className="signup-popup__captcha">
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                    options={{ theme: "dark" }}
                  />
                </div>
              ) : (
                <label className="events-form-field">
                  <span>
                    Captcha: What is {captchaChallenge.a} + {captchaChallenge.b}?
                  </span>
                  <input
                    type="number"
                    name="captcha"
                    value={form.captcha}
                    onChange={updateField}
                    required
                  />
                </label>
              )}

              <button
                type="submit"
                className="events-contact-btn signup-popup__submit"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Sign up"}
              </button>

              {status.type !== "idle" && (
                <p
                  className={
                    status.type === "success"
                      ? "social-form-status social-form-status--success"
                      : "social-form-status social-form-status--error"
                  }
                >
                  {status.message}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
