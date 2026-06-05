import fs from "node:fs";
import path from "node:path";
import { handleSubscribe } from "./functions/_lib/handleSubscribe.js";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadProjectEnv(root, mode) {
  const files = [
    ".env",
    ".env.local",
    `.env.${mode}`,
    `.env.${mode}.local`,
    ".dev.vars",
  ];
  const env = {};
  for (const file of files) {
    Object.assign(env, parseEnvFile(path.join(root, file)));
  }
  return env;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Serve POST /api/subscribe during `npm run dev` (same handler as the Cloudflare Worker). */
export function subscribeApiPlugin() {
  return {
    name: "chelzeum-subscribe-api",
    configureServer(server) {
      const root = server.config.root;
      const mode = server.config.mode;

      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split("?")[0];
        if (pathname !== "/api/subscribe") return next();

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Allow", "POST");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          const env = loadProjectEnv(root, mode);
          if (!env.RESEND_API_KEY) {
            console.warn(
              "RESEND_API_KEY is missing — add it to .env and save the file, then restart npm run dev"
            );
          }
          const body = await readBody(req);
          const host = req.headers.host || "localhost:5173";
          const request = new Request(`http://${host}/api/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": req.headers["content-type"] || "application/json",
              Host: host,
            },
            body,
          });

          const response = await handleSubscribe(request, env);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "transfer-encoding") return;
            res.setHeader(key, value);
          });
          res.end(await response.text());
        } catch (err) {
          console.error("subscribe api dev error", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Unable to send signup. Please try again later." }));
        }
      });
    },
  };
}
