import type { ComponentPropsWithRef } from 'react';
import { Button as DefaultButton } from 'react-aria-components';

import { cxTw } from '@/commons/utils';

interface ButtonProps extends ComponentPropsWithRef<typeof DefaultButton> {
  variant?: 'primary' | 'secondary' | 'text' | 'destructive' | 'icon';
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <DefaultButton
      type="button"
      className={({ isPressed, isHovered, isFocusVisible }) =>
        cxTw(
          'flex min-w-fit cursor-pointer items-center justify-center gap-2 rounded px-3 py-1.5 font-semibold text-neutral-50 outline-none transition-all',
          isPressed && 'scale-95',
          variant === 'primary' && [
            'bg-blue-500',
            (isHovered || isFocusVisible) && 'bg-blue-600',
            isPressed && 'bg-blue-700',
          ],
          variant === 'secondary' && [
            'border-2 border-blue-200 bg-white text-neutral-800',
            (isHovered || isFocusVisible) && 'border-blue-300',
            isPressed && 'border-blue-400',
          ],
          variant === 'icon' && [
            'aspect-square h-6 w-6 items-center bg-transparent p-0 text-neutral-800 opacity-80 [&_svg]:h-fit',
            (isHovered || isFocusVisible) && 'opacity-90',
            isPressed && 'opacity-100',
          ],
          variant === 'destructive' && [
            'bg-red-500/90',
            (isHovered || isFocusVisible) && 'bg-red-600',
            isPressed && 'bg-red-700',
          ],
          className
        )
      }
      {...props}
    />
  );
}
