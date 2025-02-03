import type { ComponentPropsWithRef } from 'react';

import { Label } from '~/commons/components/Label';
import { cxTw } from '~/commons/utils';

type InputProps = { label?: string } & ComponentPropsWithRef<'input'>;

export const Input = ({ label, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <Label>{label}</Label>}
            <input
                className={cxTw(
                    'rounded border border-neutral-300 px-3 py-1.5',
                    props.type === 'time' && 'w-24 text-center'
                )}
                {...props}
            />
        </div>
    );
};
