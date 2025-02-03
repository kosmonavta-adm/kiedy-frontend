import type { ComponentPropsWithRef, ReactNode } from 'react';
import {
    Button,
    DialogTrigger,
    Heading,
    Input,
    Label,
    Dialog as RACDialog,
    Modal as RACModal,
    TextField,
} from 'react-aria-components';

export interface DialogProps extends ComponentPropsWithRef<typeof RACModal> {
    children: ReactNode;
}

export const Dialog = ({ children, ref, ...props }: DialogProps) => (
    <RACModal {...props}>
        <RACDialog>{children}</RACDialog>
    </RACModal>
);
