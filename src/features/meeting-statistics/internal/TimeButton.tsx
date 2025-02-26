import { ComponentPropsWithRef } from 'react';
import { Button } from 'react-aria-components';

import { cxTw } from '@/commons/utils';

type TimeButtonProps = ComponentPropsWithRef<typeof Button>;

export function TimeButton({ children, className, ...props }: TimeButtonProps) {
  return (
    <Button
      {...props}
      className={({ isFocusVisible, isHovered }) =>
        cxTw(
          'border-b-1 flex w-full justify-between gap-2 border-transparent outline-none transition-all',
          (isFocusVisible || isHovered) && 'border-blue-300',
          className
        )
      }
    >
      {children}
    </Button>
  );
}
