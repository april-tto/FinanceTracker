import Navbar from './components/navbar';
import './globals.css';

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="content">
          {children}
        </main>
      </body>
    </html>
  );
}
