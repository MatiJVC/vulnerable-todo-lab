export default function NotesPage() {
  const samples = ['bienvenida.txt', 'plantilla-tarea.txt'];
  return (
    <main className="container">
      <h1>Notas adjuntas</h1>
      <p>Las notas se sirven por nombre de archivo desde el servidor.</p>
      <ul>
        {samples.map((f) => (
          <li key={f}>
            <a href={`/api/files?name=${encodeURIComponent(f)}`}>{f}</a>
          </li>
        ))}
      </ul>
      <p><a href="/">Volver al inicio</a></p>
    </main>
  );
}
