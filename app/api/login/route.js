import { users, makeSession, CORS } from '@/lib/store';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401, headers: CORS });
    }

    const session = makeSession(user);

    return Response.json(
      { user: { id: user.id, username: user.username } },
      {
        headers: {
          ...CORS,
          'Set-Cookie': `session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        },
      }
    );
  } catch (err) {
    return Response.json({ error: 'Error interno del servidor' }, { status: 500, headers: CORS });
  }
}
