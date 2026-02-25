'use client';

import type { ComponentProps } from 'react';
import * as React from 'react';

import type { NpmCommands } from '@/types/unist';
import type { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';

import { CheckIcon, ClipboardIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { type Event, trackEvent } from '@/lib/events';
import { cn } from '@/lib/utils';

import { Icons } from './icons';

interface CopyButtonProps extends ComponentProps<typeof Button> {
  value: string;
  event?: Event['name'];
  src?: string;
}

export function copyToClipboardWithMeta(value: string, event?: Event) {
  void navigator.clipboard.writeText(value);

  if (event) {
    trackEvent(event);
  }
}

export function CopyButton({
  className,
  event,
  src,
  value,
  variant = 'ghost',
  ...props
}: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn(
        '[&_svg]:!size-3 relative z-10 size-6 text-slate-50 hover:bg-slate-700 hover:text-slate-50',
        className
      )}
      onClick={() => {
        void copyToClipboard(value);
        if (event) {
          trackEvent({
            name: event,
            properties: {
              code: value,
            },
          });
        }
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {isCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
  commands: Required<NpmCommands>;
  icon?: React.ReactNode;
}

export function CopyWithClassNames({
  className,
  classNames,
  value,
}: CopyWithClassNamesProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'relative z-10 size-6 text-slate-50 hover:bg-slate-700 hover:text-slate-50',
            className
          )}
        >
          {isCopied ? (
            <Icons.check className="size-3" />
          ) : (
            <ClipboardIcon className="size-3" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => void copyToClipboard(value)}>
          <Icons.react />
          <span>Component</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void copyToClipboard(classNames)}>
          <Icons.tailwind />
          <span>Classname</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  classNames: string;
  value: string;
  className?: string;
}

export function CopyNpmCommandButton({
  className,
  commands,
  icon,
}: CopyNpmCommandButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const copyCommand = React.useCallback(
    (value: string, pm: 'bun' | 'npm' | 'pnpm' | 'yarn') => {
      void copyToClipboard(value);
      trackEvent({
        name: 'copy_npm_command',
        properties: {
          command: value,
          pm,
        },
      });
    },
    [copyToClipboard]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'relative z-10 size-6 text-slate-50 hover:bg-slate-700 hover:text-slate-50',
            className
          )}
        >
          {isCopied ? (
            <Icons.check className="size-3" />
          ) : (
            (icon ?? <ClipboardIcon className="size-3" />)
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => copyCommand(commands.__pnpmCommand__, 'pnpm')}
          >
            pnpm
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyCommand(commands.__npmCommand__, 'npm')}
          >
            npm
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyCommand(commands.__yarnCommand__, 'yarn')}
          >
            yarn
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyCommand(commands.__bunCommand__, 'bun')}
          >
            bun
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
