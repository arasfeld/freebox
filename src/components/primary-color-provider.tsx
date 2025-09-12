'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export type PrimaryColor =
  | 'default'
  | 'red'
  | 'rose'
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'violet';

interface PrimaryColorContextType {
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(
  undefined
);

// Primary color definitions for the UI preview
const PRIMARY_COLORS: Record<PrimaryColor, { light: string; dark: string }> = {
  default: {
    light: 'oklch(0.205 0 0)',
    dark: 'oklch(0.922 0 0)',
  },
  red: {
    light: 'oklch(0.637 0.237 25.331)',
    dark: 'oklch(0.637 0.237 25.331)',
  },
  rose: {
    light: 'oklch(0.645 0.246 16.439)',
    dark: 'oklch(0.645 0.246 16.439)',
  },
  orange: {
    light: 'oklch(0.705 0.213 47.604)',
    dark: 'oklch(0.646 0.222 41.116)',
  },
  green: {
    light: 'oklch(0.723 0.219 149.579)',
    dark: 'oklch(0.648 0.2 131.684)',
  },
  blue: {
    light: 'oklch(0.623 0.214 259.815)',
    dark: 'oklch(0.546 0.245 262.881)',
  },
  yellow: {
    light: 'oklch(0.795 0.184 86.047)',
    dark: 'oklch(0.795 0.184 86.047)',
  },
  violet: {
    light: 'oklch(0.606 0.25 292.717)',
    dark: 'oklch(0.541 0.281 293.009)',
  },
};

export function PrimaryColorProvider({
  children,
  defaultPrimaryColor = 'default',
}: {
  children: React.ReactNode;
  defaultPrimaryColor?: PrimaryColor;
}) {
  const [primaryColor, setPrimaryColorState] =
    useState<PrimaryColor>(defaultPrimaryColor);
  const { theme } = useTheme();

  useEffect(() => {
    // Load primary color from localStorage
    const savedColor = localStorage.getItem('primary-color') as PrimaryColor;
    if (savedColor && PRIMARY_COLORS[savedColor]) {
      setPrimaryColorState(savedColor);
    }
  }, []);

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
    localStorage.setItem('primary-color', color);

    // Set the data attribute on the document element
    const root = document.documentElement;
    if (color === 'default') {
      root.removeAttribute('data-primary-color');
    } else {
      root.setAttribute('data-primary-color', color);
    }
  };

  useEffect(() => {
    // Load primary color from localStorage and apply it
    const savedColor = localStorage.getItem('primary-color') as PrimaryColor;
    if (savedColor && savedColor !== 'default') {
      const root = document.documentElement;
      root.setAttribute('data-primary-color', savedColor);
    }
  }, []);

  return (
    <PrimaryColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </PrimaryColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(PrimaryColorContext);
  if (context === undefined) {
    throw new Error(
      'usePrimaryColor must be used within a PrimaryColorProvider'
    );
  }
  return context;
}
