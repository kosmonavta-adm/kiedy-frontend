import { type ComponentPropsWithRef, useId } from 'react';
import { Input as DefaultInput } from 'react-aria-components';

import { Label } from '@/commons/components/Label';
import { cxTw } from '@/commons/utils';

type InputProps = { label?: string } & ComponentPropsWithRef<typeof DefaultInput>;

export const Input = ({ label, className, ...props }: InputProps) => {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <DefaultInput
        id={id}
        className={({ isFocused, isDisabled, isHovered }) =>
          cxTw(
            'rounded-md border-2 border-neutral-300 px-3 py-1.5 outline-none transition-all',
            isHovered && isDisabled === false && 'border-blue-200',
            isFocused && 'border-blue-300',
            isDisabled && 'cursor-not-allowed bg-neutral-100 text-neutral-800',
            props.type === 'time' && 'w-24 text-center',
            className
          )
        }
        {...props}
      />
    </div>
  );
};
