// ============================================================
// pagination/PageElement.tsx
// ============================================================
import type { PlateElementProps } from 'platejs/react';
import { usePluginOption } from 'platejs/react';
import React, { useEffect, useRef } from 'react';
import { BasePaginationPlugin } from './BasePaginationPlugin';
import { usePaginationRegistry } from './registry';

export function PageElement({
  children,
  attributes,
  element,
}: PlateElementProps) {
  const registry = usePaginationRegistry();
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const settings = usePluginOption(BasePaginationPlugin, 'documentSettings');
  const { sizes, margins } = settings;

  // Find page index from path
  // Note: In Plate, you'd use useEditorRef + findNodePath
  // This is simplified — adapt to your setup
  const pageIndex = (element as any).__pageIndex ?? 0;

  // Register DOM references
  useEffect(() => {
    if (!registry || !outerRef.current || !contentRef.current) return;

    return registry.registerPage(pageIndex, {
      outer: outerRef.current,
      content: contentRef.current,
    });
  }, [registry, pageIndex]);

  const contentHeight = sizes.height - margins.top - margins.bottom;
  const contentWidth = sizes.width - margins.left - margins.right;

  return (
    <div
      {...attributes}
      ref={outerRef}
      className="relative mx-auto my-6 bg-white shadow-lg"
      style={{
        width: sizes.width,
        height: sizes.height,
        padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={contentRef}
        className="plate-page-content"
        style={{
          width: contentWidth,
          height: contentHeight,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
