import { Indicator, Item, Root } from '@radix-ui/react-radio-group';
import { type ComponentPropsWithRef, useId } from 'react';

import { Label } from '~/commons/components/Label';

export const RadioGroup = Root;

type RadioProps = ComponentPropsWithRef<typeof Item> & { label?: string };

export const Radio = ({ label, ...props }: RadioProps) => {
    const id = useId();
    return (
        <div className="flex items-center gap-2">
            <Item
                className="border-primary text-primary focus-visible:ring-ring flex aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                id={id}
                {...props}
            >
                <Indicator className="m-auto h-2.5 w-2.5 rounded-full bg-blue-500" />
            </Item>
            {label && <Label htmlFor={id}>{label}</Label>}
        </div>
    );
};
