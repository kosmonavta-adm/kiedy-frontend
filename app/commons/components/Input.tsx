import type { ComponentPropsWithRef } from 'react';
import { Input as DefaultInput } from 'react-aria-components';

import { Label } from '~/commons/components/Label';
import { cxTw } from '~/commons/utils';

type InputProps = { label?: string } & ComponentPropsWithRef<'input'>;

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <>
      {label && <Label className="mb-2">{label}</Label>}
      <DefaultInput
        className={({ isFocusVisible, isFocused }) =>
          cxTw(
            'rounded border border-neutral-300 px-3 py-1.5 outline-none',
            (isFocusVisible || isFocused) && 'border-neutral-500',
            props.type === 'time' && 'w-24 text-center',
            className
          )
        }
        {...props}
      />
    </>
  );
};
