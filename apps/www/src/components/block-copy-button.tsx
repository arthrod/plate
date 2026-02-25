'use client';

import type { ComponentProps } from 'react';
import * as React from 'react';

import { CheckIcon, ClipboardIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
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
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className={cn('size-7 rounded-[6px] [&_svg]:size-3.5', className)}
            onClick={() => {
              void copyToClipboard(code);
              trackEvent({
                name: event,
                properties: {
                  name,
                },
              });
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white">
          Copy code
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
