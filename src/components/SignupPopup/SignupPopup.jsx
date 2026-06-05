import { useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";

const DISMISS_KEY = "chelzeum-signup-dismissed";
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
const SIGNUP_API_URL = import.meta.env.VITE_SIGNUP_API_URL || "/api/subscribe";
const IS_TEST_MODE =
  import.meta.env.DEV || import.meta.env.VITE_SIGNUP_TEST_MODE === "true";
const USING_TURNSTILE_TEST_KEY =
  import.meta.env.DEV && import.meta.env.VITE_TURNSTILE_USE_PRODUCTION !== "true";

function resolveTurnstileSiteKey() {
  if (USING_TURNSTILE_TEST_KEY) {
    return import.meta.env.VITE_TURNSTILE_SITE_KEY_DEV?.trim() || TURNSTILE_TEST_SITE_KEY;
  }
  return import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? "";
}

const TURNSTILE_SITE_KEY = resolveTurnstileSiteKey();

function isTurnstileSiteKey(key) {
  return typeof key === "string" && /^(?:0x|1x|2x|3x)[\w-]{10,}$/.test(key);
}

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
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(
    () => !isTurnstileSiteKey(TURNSTILE_SITE_KEY)
  );
  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const turnstileRef = useRef(null);

  const useTurnstile = isTurnstileSiteKey(TURNSTILE_SITE_KEY) && !turnstileUnavailable;
  const useMathCaptcha = !useTurnstile;

  useEffect(() => {
    if (!IS_TEST_MODE && readDismissed()) return;
    const delay = IS_TEST_MODE ? 0 : 1200;
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || turnstileUnavailable || !isTurnstileSiteKey(TURNSTILE_SITE_KEY)) {
      setMountTurnstile(false);
      return;
    }
    const timer = window.setTimeout(() => setMountTurnstile(true), 500);
    return () => window.clearTimeout(timer);
  }, [visible, turnstileUnavailable]);

  useEffect(() => {
    if (IS_TEST_MODE || !mountTurnstile || turnstileToken || turnstileUnavailable) return;
    const timer = window.setTimeout(() => {
      setTurnstileUnavailable(true);
      setTurnstileToken("");
      setCaptchaChallenge(makeCaptcha());
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [mountTurnstile, turnstileToken, turnstileUnavailable]);

  function turnstileLoadErrorMessage() {
    const host =
      typeof window !== "undefined" ? window.location.hostname : "this site";
    const keyHint = TURNSTILE_SITE_KEY.slice(0, 8);
    if (USING_TURNSTILE_TEST_KEY) {
      return `Turnstile failed on ${host} even with Cloudflare test keys. Try http://localhost (not 127.0.0.1), disable ad blockers, or hard-refresh.`;
    }
    return `Turnstile error 110200 on "${host}" for site key ${keyHint}… — confirm that exact key’s widget in Cloudflare → Turnstile lists ${host} (and use http://localhost, not 127.0.0.1). For local dev, remove VITE_TURNSTILE_USE_PRODUCTION from .env to use Cloudflare test keys instead.`;
  }

  function fallBackToMathCaptcha() {
    if (IS_TEST_MODE) {
      setStatus({
        type: "error",
        message: turnstileLoadErrorMessage(),
      });
      return;
    }
    setTurnstileUnavailable(true);
    setTurnstileToken("");
    setCaptchaChallenge(makeCaptcha());
  }

  function dismiss() {
    if (!IS_TEST_MODE) {
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
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
      captchaA: useMathCaptcha ? captchaChallenge.a : undefined,
      captchaB: useMathCaptcha ? captchaChallenge.b : undefined,
      captchaAnswer: useMathCaptcha ? form.captcha : undefined,
    }),
    [form, turnstileToken, useTurnstile, useMathCaptcha, captchaChallenge]
  );

  function resetTurnstileWidget() {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const activeTurnstileToken =
      useTurnstile && (turnstileRef.current?.getResponse() || turnstileToken);

    if (useTurnstile && !activeTurnstileToken) {
      setStatus({ type: "error", message: "Please complete the captcha." });
      return;
    }

    if (useMathCaptcha && Number(form.captcha) !== captchaChallenge.answer) {
      setStatus({ type: "error", message: "Captcha is incorrect. Please try again." });
      setForm((prev) => ({ ...prev, captcha: "" }));
      setCaptchaChallenge(makeCaptcha());
      return;
    }

    const submitPayload = useTurnstile
      ? { ...payload, turnstileToken: activeTurnstileToken }
      : payload;

    setSubmitting(true);
    try {
      const res = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitPayload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }
      setStatus({
        type: "success",
        message: "Thank you — you're on the list. We'll be in touch soon.",
      });
      if (!IS_TEST_MODE) {
        setForm({ name: "", phone: "", email: "", captcha: "" });
        resetTurnstileWidget();
        setCaptchaChallenge(makeCaptcha());
        window.setTimeout(dismiss, 2200);
      } else {
        resetTurnstileWidget();
      }
    } catch (err) {
      if (useTurnstile) {
        resetTurnstileWidget();
      }
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

            {IS_TEST_MODE && (
              <p className="signup-popup__test-banner" role="status">
                Test mode — popup and captcha stay open for verification
                {USING_TURNSTILE_TEST_KEY ? " (Cloudflare test site key on localhost)" : ""}
              </p>
            )}
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

              {useTurnstile && mountTurnstile ? (
                <div className="signup-popup__captcha">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken("")}
                    onError={fallBackToMathCaptcha}
                    options={{ theme: "dark", size: "normal" }}
                  />
                </div>
              ) : useMathCaptcha ? (
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
              ) : null}

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
