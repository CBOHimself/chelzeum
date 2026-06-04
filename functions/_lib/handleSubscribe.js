import {
  buildSignupNotificationHtml,
  buildSignupNotificationText,
} from "./signupEmailTemplate.js";

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

async function verifyTurnstile(token, remoteip, env) {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, error: "Captcha token missing" };

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip }),
  });
  const data = await res.json();
  return data.success ? { ok: true } : { ok: false, error: "Captcha verification failed" };
}

function verifyMathCaptcha({ captchaA, captchaB, captchaAnswer }) {
  const a = Number(captchaA);
  const b = Number(captchaB);
  const answer = Number(captchaAnswer);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(answer)) {
    return false;
  }
  return answer === a + b;
}

async function sendViaResend(env, { name, phone, email }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = env.SIGNUP_TO_EMAIL || "chelzeum@gmail.com";
  const from =
    env.RESEND_FROM_EMAIL || "Chelzeum Signups <onboarding@resend.dev>";
  const html = buildSignupNotificationHtml({ name, phone, email });
  const text = buildSignupNotificationText({ name, phone, email });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Chelzeum signup — ${name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend error", res.status, detail);
    throw new Error("Email provider rejected the message.");
  }
  return true;
}

async function sendSignupEmail(env, payload) {
  if (await sendViaResend(env, payload)) return;
  throw new Error(
    "Email is not configured. Set RESEND_API_KEY in Cloudflare Pages secrets."
  );
}

export async function handleSubscribe(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const turnstileToken = body?.turnstileToken;
    const { captchaA, captchaB, captchaAnswer } = body ?? {};

    if (!name || !phone || !email) {
      return json({ error: "Name, phone, and email are required." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address." }, 400);
    }

    const remoteip = request.headers.get("CF-Connecting-IP") || undefined;
    const turnstile = await verifyTurnstile(turnstileToken, remoteip, env);

    if (!turnstile.ok) {
      return json({ error: turnstile.error || "Captcha failed" }, 400);
    }

    if (turnstile.skipped && env.TURNSTILE_SECRET_KEY) {
      return json({ error: "Captcha is not configured on the server." }, 500);
    }

    if (turnstile.skipped && !verifyMathCaptcha({ captchaA, captchaB, captchaAnswer })) {
      return json({ error: "Captcha is incorrect." }, 400);
    }

    await sendSignupEmail(env, { name, phone, email });
    return json({ ok: true });
  } catch (err) {
    console.error("subscribe error", err);
    const message =
      err.message?.includes("configured") || err.message?.includes("provider")
        ? err.message
        : "Unable to send signup. Please try again later.";
    return json({ error: message }, 500);
  }
}
