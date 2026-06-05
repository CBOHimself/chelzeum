import { handleSubscribe } from "../functions/_lib/handleSubscribe.js";

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/subscribe" || pathname.endsWith("/api/subscribe")) {
      if (request.method === "POST") {
        return handleSubscribe(request, env);
      }
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
