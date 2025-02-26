import type { ComponentPropsWithRef } from 'react';
import { Label as DefaultLabel } from 'react-aria-components';

type LabelProps = ComponentPropsWithRef<'label'>;

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <DefaultLabel
      className="flex font-bold text-neutral-900"
      {...props}
    >
      {children}
    </DefaultLabel>
  );
};
