'use client';
import React from 'react';
import { TanstackQueryProvider } from './tanstack-query-provider';
import ThemeProvider from './ThemeToggle/theme-provider';

export default function Providers({
  children,
  activeThemeValue
}: {
  activeThemeValue?: string;
  children: React.ReactNode;
}) {

  return (
    <>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TanstackQueryProvider>
          {children}
        </TanstackQueryProvider>
      </ThemeProvider>
    </>
  );
}
