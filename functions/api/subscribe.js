import { handleSubscribe } from "../_lib/handleSubscribe.js";

export async function onRequestPost(context) {
  return handleSubscribe(context.request, context.env);
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return handleSubscribe(context.request, context.env);
  }
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
}
