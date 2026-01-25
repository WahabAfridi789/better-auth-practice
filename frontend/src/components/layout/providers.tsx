'use client';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { TanstackQueryProvider } from './tanstack-query-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <TanstackQueryProvider>
          {children}
        </TanstackQueryProvider>
      </ActiveThemeProvider>
    </>
  );
}
