'use client';

import * as React from 'react';

import type { Theme } from '@/lib/themes';

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { ClipboardIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useConfig } from '@/hooks/use-config';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useThemesConfig } from '@/hooks/use-themes-config';
import { trackEvent } from '@/lib/events';
import { cn } from '@/lib/utils';

export function CopyCodeButton({
  className,
  compact,
  ...props
}: React.ComponentProps<typeof Button> & { compact?: boolean }) {
  const [config] = useConfig();
  const { themesConfig } = useThemesConfig();
  const activeTheme = themesConfig.activeTheme;
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const themeCode = React.useMemo(
    () => getThemeCode(activeTheme, config.radius),
    [activeTheme, config.radius]
  );

  if (compact) {
    return (
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          'size-7 rounded-[6px] text-primary-foreground [&_svg]:size-3.5',
          className
        )}
        onClick={() => {
          void copyToClipboard(themeCode);
          trackEvent({
            name: 'copy_theme_code',
            properties: {
              radius: config.radius,
              theme: activeTheme.name,
            },
          });
        }}
        {...props}
      >
        <span className="sr-only">Copy</span>
        {isCopied ? <CheckIcon /> : <ClipboardIcon />}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      onClick={() => {
        void copyToClipboard(themeCode);
        trackEvent({
          name: 'copy_theme_code',
          properties: {
            radius: config.radius,
            theme: activeTheme.name,
          },
        });
      }}
      {...props}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      Copy code
    </Button>
  );
}

export function getThemeCode(theme: Theme | undefined, radius: number) {
  if (!theme) {
    return '';
  }

  const rootSection =
    ':root {\n  --radius: ' +
    radius +
    'rem;\n' +
    Object.entries(theme.light)
      .map((entry) => `  ${entry[0]}: ${entry[1]};`)
      .join('\n') +
    '\n}\n\n.dark {\n' +
    Object.entries(theme.dark)
      .map((entry) => `  ${entry[0]}: ${entry[1]};`)
      .join('\n') +
    '\n}\n';

  return rootSection;
}
