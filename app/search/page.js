import { todos } from '@/lib/store';

/**
 * VULN V1 (Reflected XSS / A03):
 * Server Component que refleja `q` en el HTML SIN escapar via
 * dangerouslySetInnerHTML. La carga util viaja en la respuesta HTTP (SSR),
 * por lo que el Active Scan de OWASP ZAP la detecta como
 * "Cross Site Scripting (Reflected)".
 */
export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q ?? '';
  const results = todos.filter((t) =>
    t.title.toLowerCase().includes(String(q).toLowerCase())
  );

  return (
    <main className="container">
      <h1>Buscar tareas</h1>

      <form method="get" className="search-form">
        <input name="q" defaultValue={q} placeholder="Buscar..." />
        <button type="submit">Buscar</button>
      </form>

      {/* VULN V1: q sin sanitizar, inyectado como HTML */}
      <p dangerouslySetInnerHTML={{ __html: `Resultados para: <b>${q}</b>` }} />

      <ul>
        {results.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <p><a href="/">Volver al inicio</a></p>
    </main>
  );
}
