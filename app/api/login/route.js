import { users, makeSession, CORS } from '@/lib/store';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401, headers: CORS });
    }

    const session = makeSession(user);

    // VULN V5 (Security Misconfiguration / A05, A07):
    // la cookie de sesion se emite SIN HttpOnly, SIN Secure y SIN SameSite.
    // ZAP (passive scan) reporta: Cookie No HttpOnly Flag, Cookie Without Secure
    // Flag y Cookie Without SameSite Attribute.
    return Response.json(
      { user: { id: user.id, username: user.username } },
      {
        headers: {
          ...CORS,
          'Set-Cookie': `session=${session}; Path=/`,
        },
      }
    );
  } catch (err) {
    // bonus V: error verboso -> ZAP "Application Error Disclosure".
    return Response.json({ error: err.message, stack: err.stack }, { status: 500, headers: CORS });
  }
}
