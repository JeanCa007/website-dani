import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageShellProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function PageShell({ children, pageTitle }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {pageTitle && (
          <div className="py-12 px-4 bg-background-100 border-b border-background-200">
            <div className="max-w-6xl mx-auto">
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950">
                {pageTitle}
              </h1>
            </div>
          </div>
        )}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}