import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="p-8">
        {children}
      </div>
    </>
  );
}
