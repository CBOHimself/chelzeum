import {
  buildSignupNotificationHtml,
  buildSignupNotificationText,
} from "./signupEmailTemplate.js";

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

function isLocalHost(request) {
  const host = request.headers.get("Host") || "";
  return /^localhost(:\d+)?$/i.test(host) || /^127\.0\.0\.1(:\d+)?$/.test(host);
}

function allowTestTurnstileKeys(request, env) {
  return env.TURNSTILE_ALLOW_TEST_KEYS === "true" || isLocalHost(request);
}

async function verifyTurnstileWithSecret(secret, token, remoteip) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip }),
  });
  const data = await res.json();
  if (data.success) return { ok: true };
  console.error("Turnstile siteverify failed", data["error-codes"] || data);
  return {
    ok: false,
    error: "Captcha verification failed. Complete the captcha again and resubmit.",
    errorCodes: data["error-codes"],
  };
}

async function verifyTurnstile(token, remoteip, env, request) {
  if (!token) return { ok: false, error: "Captcha token missing" };

  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      error:
        "Captcha is not configured on the server. Set TURNSTILE_SECRET_KEY in Cloudflare secrets.",
    };
  }

  const primary = await verifyTurnstileWithSecret(secret, token, remoteip);
  if (primary.ok) return primary;

  if (allowTestTurnstileKeys(request, env) && secret !== TURNSTILE_TEST_SECRET) {
    const fallback = await verifyTurnstileWithSecret(TURNSTILE_TEST_SECRET, token, remoteip);
    if (fallback.ok) return fallback;
  }

  if (primary.errorCodes?.includes("timeout-or-duplicate")) {
    return {
      ok: false,
      error: "Captcha expired or was already used. Complete it again and resubmit.",
    };
  }

  return primary;
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
    let message = "Email provider rejected the message.";
    try {
      const parsed = JSON.parse(detail);
      if (parsed.message) {
        message = parsed.message;
        if (/your own email address/i.test(parsed.message)) {
          message +=
            " Until chelzeum.net is verified in Resend, set SIGNUP_TO_EMAIL to your Resend login email (charlesbryanoware@hotmail.com).";
        } else if (/verify a domain/i.test(parsed.message)) {
          message +=
            " Verify chelzeum.net at https://resend.com/domains and set RESEND_FROM_EMAIL to an address on that domain.";
        }
      }
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
  return true;
}

async function sendSignupEmail(env, payload) {
  if (await sendViaResend(env, payload)) return;
  throw new Error(
    "Email is not configured. Set RESEND_API_KEY (delivers to SIGNUP_TO_EMAIL, e.g. chelzeum@gmail.com)."
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
    const mathOk = verifyMathCaptcha({ captchaA, captchaB, captchaAnswer });

    if (turnstileToken) {
      const turnstile = await verifyTurnstile(turnstileToken, remoteip, env, request);
      if (!turnstile.ok) {
        return json({ error: turnstile.error || "Captcha verification failed" }, 400);
      }
    } else if (mathOk) {
      /* Math captcha fallback */
    } else if (env.TURNSTILE_SECRET_KEY) {
      return json({ error: "Please complete the captcha." }, 400);
    } else {
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
