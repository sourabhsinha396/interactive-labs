'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { ThemeToggler } from '@/components/animate-ui/primitives/effects/theme-toggler';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const currentTheme = (theme || 'system') as 'light' | 'dark' | 'system';
  const currentResolved = (resolvedTheme || 'light') as 'light' | 'dark';

  return (
    <ThemeToggler
      theme={currentTheme}
      resolvedTheme={currentResolved}
      setTheme={setTheme}
      direction="ltr" // left-to-right animation
    >
      {({ effective, toggleTheme }) => (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const nextTheme = 
              effective === 'light' 
                ? 'dark' 
                : effective === 'dark' 
                ? 'system' 
                : 'light';
            toggleTheme(nextTheme);
          }}
          className="relative"
        >
          {effective === 'system' ? (
            <Monitor className="h-5 w-5" />
          ) : effective === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </ThemeToggler>
  );
}