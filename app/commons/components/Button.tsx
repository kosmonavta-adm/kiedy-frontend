import type { ComponentPropsWithRef } from 'react';
import { Button as DefaultButton } from 'react-aria-components';

import { cxTw } from '~/commons/utils';

interface ButtonProps extends ComponentPropsWithRef<typeof DefaultButton> {
  variant: 'primary' | 'destructive' | 'icon';
}

export function Button({ className = '', variant = 'primary', ...props }) {
  return (
    <DefaultButton
      type="button"
      className={({ isPressed, isPending, isHovered }) =>
        cxTw(
          'flex min-w-fit cursor-pointer items-center justify-center gap-2 rounded px-3 py-1.5 font-semibold text-white transition-colors outline-none',
          variant === 'primary' && ['bg-blue-500', isHovered && 'bg-blue-600', isPressed && 'bg-blue-700'],
          variant === 'icon' && [
            'aspect-square h-6 w-6 items-center bg-transparent p-0 text-black opacity-80 [&_svg]:h-fit',
            isHovered && 'opacity-90',
            isPressed && 'opacity-100',
          ],
          variant === 'destructive' && ['bg-red-500/90', isHovered && 'bg-red-600', isPressed && 'bg-red-700'],
          isPending && 'cursor-not-allowed bg-neutral-200 text-neutral-600',
          className
        )
      }
      {...props}
    />
  );
}
