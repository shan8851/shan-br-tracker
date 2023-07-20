import { type FunctionComponent, type ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
