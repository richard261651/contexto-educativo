import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IED Matcher • Asistente Logístico de Prácticas Docentes (Barranquilla)',
  description: 'Asistente inteligente de compatibilidad horaria, logística y asignación de prácticas docentes para colegios IED en Barranquilla, Soledad y Puerto Colombia.',
  keywords: ['IED', 'Barranquilla', 'Prácticas Docentes', 'Horarios', 'Pedagogía', 'Uninorte', 'Uniatlántico', 'CUC'],
  authors: [{ name: 'IED Matcher Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
