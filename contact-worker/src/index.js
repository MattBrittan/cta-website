const MAX_BYTES = 32768;
const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

/** Read with an enforced byte limit, including chunked bodies. @param {Request} request */
async function readBody(request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  const timeout = setTimeout(() => { void reader.cancel(); }, 10000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes));
  } finally { clearTimeout(timeout); reader.releaseLock(); }
}

/** @type {ExportedHandler<Env>} */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowed = env.ALLOWED_ORIGINS.split(',').map(value => value.trim());
    /** @type {Record<string, string>} */
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Vary': 'Origin',
    };
    /** @param {number} status @param {string} message */
    const reply = (status, message) => new Response(JSON.stringify({ ok: status === 200, message }), { status, headers });
    if (url.pathname !== '/contact') return reply(404, 'Not found.');
    if (!origin || !allowed.includes(origin)) return reply(403, 'Please use the contact form on the CTA website.');
    headers['Access-Control-Allow-Origin'] = origin;
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
    }
    if (request.method !== 'POST') return reply(405, 'Please submit the contact form.');
    if (env.CONTACT_ENABLED !== 'true' || !env.TURNSTILE_SECRET_KEY) return reply(503, 'The contact form is temporarily unavailable. Please try again later.');
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return reply(415, 'Please submit the contact form.');
    try {
      // Anonymous visitors have no account ID; this short limit may be shared by people on one network.
      const ip = request.headers.get('CF-Connecting-IP');
      if (!ip) return reply(403, 'Please use the contact form on the CTA website.');
      const limit = await env.CONTACT_LIMIT.limit({ key: ip });
      if (!limit.success) return new Response(JSON.stringify({ ok: false, message: 'Too many attempts. Please wait a minute and try again.' }), { status: 429, headers: { ...headers, 'Retry-After': '60' } });
      let data;
      try { data = await readBody(request); }
      catch (error) { return reply(error instanceof RangeError ? 413 : 400, 'Please check your message and try again.'); }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Please check your message and try again.');
      const { name, email, message, token, website } = data;
      if (website) return reply(400, 'Please check your message and try again.');
      if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\x00-\x1f\x7f]/.test(name) ||
          typeof email !== 'string' || email.length > 254 || !EMAIL.test(email) ||
          typeof message !== 'string' || !message.trim() || message.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message) ||
          typeof token !== 'string' || !token || token.length > 2048) return reply(400, 'Please enter your name, a valid email address and a message, then complete the security check.');
      let verification;
      try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error('Verification unavailable');
        verification = await response.json();
      } catch { return reply(503, 'The security check is unavailable. Please try again shortly.'); }
      if (verification.success !== true || verification.action !== 'contact' || verification.hostname !== new URL(origin).hostname) return reply(400, 'The security check expired or failed. Please complete it again.');
      // Never accept a recipient or sender from the request. No automatic emails to visitors.
      await env.CONTACT_EMAIL.send({
        to: env.CONTACT_TO,
        from: { email: env.CONTACT_FROM, name: 'CTA website' },
        replyTo: email,
        subject: 'CTA website enquiry',
        text: `New enquiry from the CTA website\n\nName: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}\n\n---\nSent through the CTA contact form. Reply to this email to contact the sender.`,
      });
      return reply(200, 'Thank you. Your message has been sent to the CTA team.');
    } catch {
      // Do not log names, email addresses, message text, IP addresses or Turnstile tokens.
      console.error(JSON.stringify({ event: 'contact_delivery_failed' }));
      return reply(503, 'We could not confirm that your message was sent. Please try again later.');
    }
  },
};
