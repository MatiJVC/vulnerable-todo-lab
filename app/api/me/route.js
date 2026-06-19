import { readSession, CORS } from '@/lib/store';

export async function GET(req) {
  const sess = readSession(req);
  if (!sess) {
    return Response.json({ error: 'No autenticado' }, { status: 401, headers: CORS });
  }
  return Response.json({ user: sess }, { headers: CORS });
}
