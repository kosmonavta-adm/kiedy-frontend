import type { ComponentPropsWithRef } from 'react';

type LabelProps = ComponentPropsWithRef<'label'>;

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <label
      className="flex"
      {...props}
    >
      {children}
    </label>
  );
};
