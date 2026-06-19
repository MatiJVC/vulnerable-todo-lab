/**
 * __tests__/security.test.js  (node:test, sin dependencias)
 * Requiere la app corriendo en http://localhost:3000.
 *
 * Validan comportamiento SEGURO -> en la app VULNERABLE FALLAN a proposito
 * (rojo). Tras la remediacion deben pasar a verde. Son la red de seguridad que
 * complementa al DAST (ZAP) en el pipeline.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const BASE = process.env.BASE_URL || 'http://localhost:3000';

test('V5 - la cookie de sesion debe tener HttpOnly', async () => {
  const r = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'alice', password: 'alice123' }),
  });
  const sc = r.headers.get('set-cookie') || '';
  assert.match(sc, /HttpOnly/i, 'Set-Cookie deberia incluir HttpOnly');
});

test('V4 - deben existir security headers (CSP)', async () => {
  const r = await fetch(`${BASE}/`);
  assert.ok(r.headers.get('content-security-policy'), 'falta Content-Security-Policy');
});

test('V2 - Path Traversal: no debe leer /etc/passwd', async () => {
  const r = await fetch(`${BASE}/api/files?name=../../../../../../etc/passwd`);
  const body = await r.text();
  assert.ok(!/root:.*:0:0:/.test(body), 'el endpoint devolvio /etc/passwd (path traversal)');
});

test('V3 - Open Redirect: no debe redirigir a dominios externos', async () => {
  const r = await fetch(`${BASE}/api/go?url=https://evil.example/phish`, { redirect: 'manual' });
  const loc = r.headers.get('location') || '';
  assert.ok(!/^https?:\/\/evil\.example/i.test(loc), `redirige a externo: ${loc}`);
});

test('V1 - Reflected XSS: el query no debe reflejarse como HTML crudo', async () => {
  const r = await fetch(`${BASE}/search?q=${encodeURIComponent('<script>alert(1)</script>')}`);
  const html = await r.text();
  assert.ok(!html.includes('<script>alert(1)</script>'), 'el payload <script> se reflejo sin escapar');
});
