/**
 * next.config.js
 *
 * VULN V5 (Security Misconfiguration): NO se definen security headers.
 * No hay Content-Security-Policy, X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy ni Permissions-Policy. El passive scan de OWASP ZAP
 * reportara estas ausencias.
 *
 * (En la version corregida se agrega el bloque async headers() con CSP, etc.)
 */
const nextConfig = {};

module.exports = nextConfig;
