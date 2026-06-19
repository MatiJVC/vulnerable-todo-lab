import { readFileSync } from 'fs';
import { join } from 'path';
import { CORS } from '@/lib/store';

/**
 * VULN V2 (Path Traversal / A01):
 * GET /api/files?name=<archivo> lee desde ./data/notes SIN sanitizar `name`.
 * Con name=../../../../etc/passwd se escapa del directorio y se leen archivos
 * arbitrarios. El Active Scan de OWASP ZAP detecta "Path Traversal" porque la
 * respuesta devuelve el contenido del archivo solicitado.
 */
const NOTES_DIR = join(process.cwd(), 'data', 'notes');

export async function GET(req) {
  const name = new URL(req.url).searchParams.get('name') || 'bienvenida.txt';
  try {
    // <-- Falta: validar/normalizar `name` y confinarlo a NOTES_DIR
    const content = readFileSync(join(NOTES_DIR, name), 'utf-8');
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  } catch (err) {
    // error verboso (bonus): ZAP "Application Error Disclosure"
    return new Response(`Error leyendo archivo: ${err.message}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  }
}
