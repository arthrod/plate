import * as React from 'react';

import type { TDateElement } from 'platejs';
import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

export function DateElementStatic(props: SlateElementProps<TDateElement>) {
  const { element } = props;

  return (
    <SlateElement as="span" className="inline-block" {...props}>
      <span className="w-fit rounded-sm bg-muted px-1 text-muted-foreground">
        {element.date ? (
          (() => {
            const today = new Date();
            const elementDate = new Date(element.date);
            
            const todayStr = today.toDateString();
            const elementDateStr = elementDate.toDateString();
            
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const isToday =
              elementDateStr === todayStr;
            const isYesterday = elementDateStr === yesterday.toDateString();
            const isTomorrow = elementDateStr === tomorrow.toDateString();

            if (isToday) return 'Today';
            if (isYesterday) return 'Yesterday';
            if (isTomorrow) return 'Tomorrow';

            return elementDate.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          })()
        ) : (
          <span>Pick a date</span>
        )}
      </span>
      {props.children}
    </SlateElement>
  );
}
