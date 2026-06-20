import { readFileSync } from 'fs';
import { resolve, relative, isAbsolute } from 'path';
import { CORS } from '@/lib/store';

const NOTES_DIR = resolve(process.cwd(), 'data', 'notes');

export async function GET(req) {
  const name = new URL(req.url).searchParams.get('name') || 'bienvenida.txt';
  try {
    const filePath = resolve(NOTES_DIR, name);
    const rel = relative(NOTES_DIR, filePath);
    if (rel.startsWith('..') || isAbsolute(rel)) {
      return new Response('Acceso no permitido', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
      });
    }
    const content = readFileSync(filePath, 'utf-8');
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  } catch (err) {
    return new Response('Error leyendo archivo', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  }
}
