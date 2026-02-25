'use client';

import * as React from 'react';

import { type ExternalToast, toast } from 'sonner';

export const useCopyPathnameToClipboard = () => {
  const { copyToClipboard } = useCopyToClipboard();

  return {
    copyPathnameToClipboard: (data?: ExternalToast) => {
      const currentUrl = window.location.href;
      void copyToClipboard(currentUrl);
      toast.success('Copied to clipboard', data);
    },
  };
};

export const useCopyToClipboard = ({
  timeout = 2000,
}: {
  timeout?: number;
} = {}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = React.useCallback(
    (
      value: string,
      { data, tooltip }: { data?: ExternalToast; tooltip?: string } = {}
    ) => {
      if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
        return Promise.resolve();
      }
      if (!value) {
        return Promise.resolve();
      }

      return navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          timeoutRef.current = null;
        }, timeout);

        if (tooltip) {
          toast.success(tooltip, data);
        }
      });
    },
    [timeout]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copyToClipboard, isCopied };
};
