'use client';

import type { ComponentProps } from 'react';
import * as React from 'react';

import { CheckIcon, ClipboardIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { type Event, trackEvent } from '@/lib/events';
import { cn } from '@/lib/utils';

export function BlockCopyButton({
  className,
  code,
  event,
  name,
  ...props
}: {
  code: string;
  event: Event['name'];
  name: string;
} & ComponentProps<typeof Button>) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hasCopied]);

  const trigger = (
    <Button
      size="icon"
      variant="outline"
      className={cn('size-7 rounded-[6px] [&_svg]:size-3.5', className)}
      onClick={() => {
        void navigator.clipboard.writeText(code);
        trackEvent({
          name: event,
          properties: {
            name,
          },
        });
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">{hasCopied ? 'Copied' : 'Copy'}</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );

  return (
    <ClientTooltipWrapper content={hasCopied ? 'Copied!' : 'Copy code'}>
      {trigger}
    </ClientTooltipWrapper>
  );
}

function ClientTooltipWrapper({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const [TooltipComponents, setTooltipComponents] = React.useState<{
    Tooltip: React.ComponentType<{ children: React.ReactNode }>;
    TooltipContent: React.ComponentType<{
      className?: string;
      children: React.ReactNode;
    }>;
    TooltipTrigger: React.ComponentType<{
      asChild?: boolean;
      children: React.ReactNode;
    }>;
  } | null>(null);

  React.useEffect(() => {
    // Dynamically import Tooltip components to avoid build issues in Edge Runtime
    import('@/components/ui/tooltip').then((mod) => {
      setTooltipComponents({
        Tooltip: mod.Tooltip,
        TooltipContent: mod.TooltipContent,
        TooltipTrigger: mod.TooltipTrigger,
      });
    });
  }, []);

  if (!TooltipComponents) {
    return <>{children}</>;
  }

  const { Tooltip, TooltipContent, TooltipTrigger } = TooltipComponents;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="bg-black text-white">{content}</TooltipContent>
    </Tooltip>
  );
}
