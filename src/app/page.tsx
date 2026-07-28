'use client';

import { AppProvider } from '@/context/AppContext';
import { App } from '@/components/App';
import { Toaster } from '@/components/ui/toaster';

export default function Page() {
  return (
    <AppProvider>
      <App />
      <Toaster />
    </AppProvider>
  );
}
