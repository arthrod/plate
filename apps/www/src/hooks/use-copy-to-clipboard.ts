'use client';

import * as React from 'react';

import { type ExternalToast, toast } from 'sonner';

export const useCopyPathnameToClipboard = () => {
  const { copyToClipboard } = useCopyToClipboard();

  return {
    copyPathnameToClipboard: (data?: ExternalToast) => {
      const currentUrl = window.location.href;
      copyToClipboard(currentUrl);
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

  React.useEffect(() => {
    if (!isCopied) return;

    const t = setTimeout(() => {
      setIsCopied(false);
    }, timeout);

    return () => clearTimeout(t);
  }, [isCopied, timeout]);

  const copyToClipboard = React.useCallback(
    (
      value: string,
      { data, tooltip }: { data?: ExternalToast; tooltip?: string } = {}
    ) => {
      if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
        return;
      }
      if (!value) {
        return;
      }

      void navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);
      });

      if (tooltip) {
        toast.success(tooltip, data);
      }
    },
    []
  );

  return { copyToClipboard, isCopied };
};
