import type { ReactNode } from 'react';
import {
  Tooltip as DefaultTooltip,
  type TooltipProps as DefaultTooltipProps,
  TooltipTrigger as DefaultTooltipTrigger,
  OverlayArrow,
  TooltipTriggerComponentProps,
} from 'react-aria-components';

import { cxTw } from '@/commons/utils';

interface TooltipProps extends Omit<DefaultTooltipProps, 'children'> {
  children: ReactNode;
}

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  return (
    <DefaultTooltip
      className={cxTw(
        'pointer-events-none -translate-y-2 rounded-md bg-neutral-700 px-5 py-3 font-medium text-neutral-50'
      )}
      {...props}
    >
      <OverlayArrow>
        <svg
          className="fill-neutral-700"
          width={12}
          height={12}
          viewBox="0 0 8 8"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </DefaultTooltip>
  );
};

export const TooltipTrigger = ({ children, ...props }: TooltipTriggerComponentProps) => (
  <DefaultTooltipTrigger
    delay={1000}
    {...props}
  >
    {children}
  </DefaultTooltipTrigger>
);
