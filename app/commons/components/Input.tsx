import type { ComponentPropsWithRef } from 'react';

import { Label } from '~/commons/components/Label';

type InputProps = { label?: string } & ComponentPropsWithRef<'input'>;

export const Input = ({ label, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <Label>{label}</Label>}
            <input
                className="border border-neutral-300 rounded px-3 py-1.5"
                {...props}
            />
        </div>
    );
};
