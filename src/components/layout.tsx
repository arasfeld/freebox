'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { LoginBtn } from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  showHeader = true,
  showFooter = true,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {showHeader && (
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold hover:opacity-80 transition-opacity"
              >
                Freebox
              </Link>
              <p className="text-muted-foreground">Everything is free</p>
            </div>
            <div className="flex items-center space-x-4">
              <LoginBtn />
              <ModeToggle />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      {showFooter && (
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2024 Freebox. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
