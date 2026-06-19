import './globals.css';

export const metadata = {
  title: 'Vulnerable To-Do Lab',
  description: 'App intencionalmente vulnerable — uso educativo (DSS / UCN)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="banner">
          ⚠️ Entorno intencionalmente vulnerable — solo uso local y educativo
        </div>
        {children}
      </body>
    </html>
  );
}
