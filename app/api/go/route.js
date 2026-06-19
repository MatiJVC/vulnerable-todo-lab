import { CORS } from '@/lib/store';

/**
 * VULN V3 (Open Redirect / A01):
 * GET /api/go?url=<destino> responde 302 con Location = url SIN validar que el
 * destino sea interno/permitido. Permite redirigir a sitios externos
 * (phishing). El Active Scan de OWASP ZAP detecta "External Redirect".
 */
export async function GET(req) {
  const url = new URL(req.url).searchParams.get('url') || '/';
  // <-- Falta: validar que `url` sea una ruta interna o este en una allowlist
  return new Response(null, {
    status: 302,
    headers: { Location: url, ...CORS },
  });
}
