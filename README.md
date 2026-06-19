# Vulnerable To-Do Lab

> ## ⚠️ ADVERTENCIA
> Aplicación **intencionalmente vulnerable**, con fines **exclusivamente educativos**
> (ramo *Desarrollo Seguro de Software*, UCN). **Ejecútala solo localmente o en una
> VM aislada. NUNCA la despliegues en internet.**

Lista de tareas simple, sin base de datos (datos en memoria), con **5
vulnerabilidades que OWASP ZAP detecta** (3 con Active Scan, 2 con Passive Scan).

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
npm run dev        # http://localhost:3000
```

## Cuentas de prueba

| Usuario | Contraseña |
|---------|------------|
| alice   | alice123   |
| bob     | bob123     |

## Las 5 vulnerabilidades (todas detectables por ZAP)

| # | Vulnerabilidad | OWASP 2021 | Scan ZAP | Alerta ZAP | Ubicación |
|---|----------------|-----------|----------|-----------|-----------|
| V1 | Reflected XSS | A03 | Activo | Cross Site Scripting (Reflected) | `app/search/page.js` |
| V2 | Path Traversal | A01 | Activo | Path Traversal | `app/api/files/route.js` |
| V3 | Open Redirect | A01 | Activo | External Redirect | `app/api/go/route.js` |
| V4 | Missing Security Headers | A05 | Pasivo | CSP not set / Anti-clickjacking / X-Content-Type-Options | `next.config.js` |
| V5 | Cookie de sesión insegura | A05/A07 | Pasivo | Cookie No HttpOnly / Secure / SameSite | `app/api/login/route.js` |

Hallazgos **bonus** que ZAP también reporta: CORS `*` (*Cross-Domain
Misconfiguration*) y errores verbosos (*Application Error Disclosure*).

## ⚠️ Importante: usa Active Scan / full-scan

El **Baseline** de ZAP es pasivo y solo encuentra V4 y V5. Para detectar el
**100%** (V1–V3) debes correr el **Active Scan** (ZAP Desktop) o
**`zap-full-scan.py`** (CI). El pipeline incluido ya usa full-scan.

## Tests y CI

```bash
npm run dev      # terminal 1
npm test         # terminal 2 (requiere la app en :3000)
```

En la versión **vulnerable** los tests **fallan a propósito** (5/5 en rojo);
tras la remediación pasan a verde. El workflow `.github/workflows/security.yml`
ejecuta SAST (Semgrep), `npm audit`, los tests y un ZAP **full-scan** (DAST).
