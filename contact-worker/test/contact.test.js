import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const origin = 'https://craigieburntrapping.nz';
const valid = { name: 'Test volunteer', email: 'volunteer@example.org', message: 'Kia ora — I would like to help with a trap line.', token: 'test-token', website: '' };
async function run(data = valid, options = {}) {
  const calls = { sent: [], verified: 0 };
  const env = {
    CONTACT_ENABLED: 'true', CONTACT_TO: 'craigieburntrapping@gmail.com', CONTACT_FROM: 'website@craigieburn.nz',
    ALLOWED_ORIGINS: origin, TURNSTILE_SECRET_KEY: 'unit-test-secret',
    CONTACT_LIMIT: { limit: async () => ({ success: !options.limited }) },
    CONTACT_EMAIL: { send: async message => { if (options.sendFails) throw new Error('Rejected'); calls.sent.push(message); } },
  };
  if (options.disabled) env.CONTACT_ENABLED = 'false';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.verified++;
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(JSON.parse(init.body).secret, 'unit-test-secret');
    if (options.verifyFails) throw new Error('Unavailable');
    return Response.json(options.verification || { success: true, action: 'contact', hostname: 'craigieburntrapping.nz' });
  };
  try {
    const method = options.method || 'POST';
    const request = new Request('https://contact.example/contact', {
      method,
      headers: { Origin: options.origin ?? origin, 'Content-Type': options.type || 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
      ...(method === 'POST' ? { body: options.raw ?? JSON.stringify(data) } : {}),
    });
    const response = await worker.fetch(request, env);
    return { response, calls, body: response.status === 204 ? null : await response.json() };
  } finally { globalThis.fetch = originalFetch; }
}

test('valid enquiry sends only to the configured recipient, preserving Unicode and reply address', async () => {
  const {response,calls,body} = await run({...valid,to:'attacker@example.org',from:'spoof@example.org'});
  assert.equal(response.status,200); assert.equal(body.ok,true); assert.equal(calls.sent.length,1);
  assert.equal(calls.sent[0].to,'craigieburntrapping@gmail.com'); assert.equal(calls.sent[0].from.email,'website@craigieburn.nz');
  assert.equal(calls.sent[0].replyTo, valid.email); assert.ok(calls.sent[0].text.includes(valid.message));
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
});
test('rejects foreign and null origins before challenge or sending', async()=>{
 for(const value of ['https://evil.example','null','https://craigieburntrapping.nz.evil.example']) {
  const r=await run(valid,{origin:value});assert.equal(r.response.status,403);assert.equal(r.calls.verified,0);assert.equal(r.calls.sent.length,0);
 }
});
test('CORS preflight is allowed only for the configured website',async()=>{const r=await run(valid,{method:'OPTIONS'});assert.equal(r.response.status,204);assert.equal(r.calls.sent.length,0);});
test('rejects GET and non-JSON requests',async()=>{assert.equal((await run(valid,{method:'GET'})).response.status,405);assert.equal((await run(valid,{type:'text/plain'})).response.status,415);});
test('rejects malformed, oversized and invalid fields without sending',async()=>{
 for(const data of [null,[],{}, {...valid,email:'a@b.org\r\nBcc: victim@example.org'}, {...valid,name:'\nSpoof'}, {...valid,message:' '}, {...valid,message:'a'.repeat(5001)}, {...valid,token:''}, {...valid,website:'spam'}]) {
  const r=await run(data);assert.equal(r.response.status,400);assert.equal(r.calls.sent.length,0);
 }
 assert.equal((await run(valid,{raw:'{'})).response.status,400);
 assert.equal((await run(valid,{raw:'x'.repeat(33000)})).response.status,413);
});
test('rate limit prevents verification and sending',async()=>{const r=await run(valid,{limited:true});assert.equal(r.response.status,429);assert.equal(r.response.headers.get('Retry-After'),'60');assert.equal(r.calls.verified,0);});
test('fails closed for invalid, replayed, wrong-action and wrong-host tokens',async()=>{
 for(const verification of [{success:false,'error-codes':['timeout-or-duplicate']},{success:true,hostname:'evil.example',action:'contact'},{success:true,hostname:'craigieburntrapping.nz',action:'login'}]) {
  const r=await run(valid,{verification});assert.equal(r.response.status,400);assert.equal(r.calls.sent.length,0);
 }
});
test('verification outage and disabled form never send',async()=>{
 for(const options of [{verifyFails:true},{disabled:true}]) {const r=await run(valid,options);assert.equal(r.response.status,503);assert.equal(r.calls.sent.length,0);}
});
test('email failure never returns a success confirmation',async()=>{const r=await run(valid,{sendFails:true});assert.equal(r.response.status,503);assert.equal(r.body.ok,false);});
